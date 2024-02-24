import { SupabaseClient } from "@supabase/supabase-js";
import { ReadonlyURLSearchParams } from "next/navigation";
import { ProductsT, SearchParams } from "./types";

// 1) inserts search params into params string
// 2) replaces old params if old params are present
export function insertSearchParams(currentParams: ReadonlyURLSearchParams, paramToInsert: Object) {
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

// idk how to order by review.rating
// im stuck here if i wanna sort by most rated
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

  if (order === 'rating_desc') {
    const { data: products } = await supabase
      .rpc('get_test', {
        price_from: priceFrom, 
        price_to: priceTo, 
        search_text: text
      })
      .range(from, to);

    return products as ProductsT;
  }

  const priceOrder = order === 'price_asc' || false;

  const { data: products } = await supabase
    .from('product')
    .select('*, review(rating)')
    .textSearch('title', `${text}`)
    .gte('price', priceFrom || 0)
    .lte('price', priceTo || 1000000000)
    .range(from, to)
    .order('price', { ascending: priceOrder })

  return products as ProductsT;
};

export type ProductsWithRatingType = Awaited<ReturnType<typeof loadProducts>>;