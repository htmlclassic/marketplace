import { createServerComponentSupabaseClient } from "@/supabase/utils_server";

export async function getProduct(productId: string) {
  const supabase = createServerComponentSupabaseClient();

  const { data: product } = await supabase
    .from('product')
    .select(`
      *, 
      product_characteristic(name, value),
      favorite_product(product_id),
      review(rating)
    `)
    .eq('id', productId)
    .limit(1)
    .single();

  return product;
}