import { QueryData, SupabaseClient } from "@supabase/supabase-js";
import { ReadonlyURLSearchParams } from "next/navigation";
import { OrderSearchParam, SearchParams } from "./types";

interface ParamsToInsert {
  order?: OrderSearchParam;
  price_from?: number;
  price_to?: number;
}

// 1) inserts search params into params string
// 2) replaces old params if old params are present
export function insertSearchParams(currentParams: ReadonlyURLSearchParams, paramToInsert: ParamsToInsert) {
  let newParams = '';

  const entries = Object.entries(paramToInsert);
  const keys = entries.map(entry => entry[0]);

  // filter existing params
  for (const [key, value] of Array.from(currentParams.entries())) {
    if (keys.includes(key)) continue;

    newParams += `${key}=${value}&`;
  }
  
  // insert new params
  for (const [key, value] of entries) {
    newParams += `${key}=${value}&`;
  }

  // delete redundant '&' character
  newParams = newParams.slice(0, -1);

  return newParams;
}

export async function loadProducts(
  supabase: SupabaseClient<Database>,
  searchParams: SearchParams,
  from: number, 
  to: number
) {
  const text = searchParams.text || '';
  const order = searchParams.order;
  const priceFrom = Number(searchParams.price_from) || 0;
  const priceTo = Number(searchParams.price_to) || 1_000_000_000;

  const ascendingPriceOrder = order === 'price_asc' || false;
  let orderColumn = 'price';

  interface OrderOptions {
    ascending: boolean;
    nullsFirst?: boolean;
  }
  let orderOptions: OrderOptions = { ascending: ascendingPriceOrder };

  if (order === 'rating_desc') {
    orderColumn = 'avg_rating';
    orderOptions = { ascending: false, nullsFirst: false };
  }

  const query = supabase
    .rpc('get_products_with_avg_rating')
    .textSearch('title', `${text}`)
    .gte('price', priceFrom)
    .lte('price', priceTo)
    .range(from, to)
    .order(orderColumn, orderOptions)
    .order('created_at', { ascending: true }); // avoid showing the same products on lazy load
  
  const { data: products } = await query;
  
  // Supabase gen ts types setting avg_rating to number. but it's actually number | null
  // I change this type manually here
  type T = QueryData<typeof query>;
  type ProductsWithAvgRating =
    (Omit<ArrayElement<T>, 'avg_rating'> & { avg_rating: number | null })[] | null;

  return products as ProductsWithAvgRating;
};

export type ProductsWithAvgRating = Awaited<ReturnType<typeof loadProducts>>;