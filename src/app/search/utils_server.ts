import { createServerComponentSupabaseClient } from "@/supabase/utils_server";

export async function getProducts(
  queryText: string | undefined,
  priceFrom: string = '0',
  priceTo: string = '1000000'
  ) {
  const supabase = createServerComponentSupabaseClient();

  const { data } = await supabase
    .from('product')
    .select('*, review(rating)')
    .textSearch('title', `'${queryText}'`)
    .gte('price', +priceFrom)
    .lte('price', +priceTo)
    .order('title', { ascending: true });

  return data;
}