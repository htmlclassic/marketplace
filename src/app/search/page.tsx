import { getAPI } from '@/supabase/api';
import { createServerComponentSupabaseClient } from '@/supabase/utils_server';
import ProductList from './ProductList';

export default async function Catalog() {
  const api = getAPI(createServerComponentSupabaseClient());
  const products = await api.getProducts();

  return (
    <div className="grid grid-cols-[repeat(auto-fit,260px)] justify-center gap-7 w-full">
      <ProductList  products={products} />
    </div>
  );
}