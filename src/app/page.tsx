import { createServerComponentSupabaseClient } from '../../supabase/utils_server';
import ProductList from './ProductList';
import { PRODUCTS_TO_FETCH_COUNT } from './constants';

export default async function Catalog() {
  const supabase = createServerComponentSupabaseClient();
  
  const { data: products } = await supabase
    .from('product')
    .select()
    .gt('quantity', 0)
    .limit(PRODUCTS_TO_FETCH_COUNT)
    .order('created_at', { ascending: false });
  
  return (
      <ProductList products={products ?? []} />
  );
}