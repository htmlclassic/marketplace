import { getAPI } from '@/supabase/api';
import { createServerComponentSupabaseClient } from '@/supabase/utils_server';
import ProductList from './ProductList';

export default async function Catalog() {
  const api = getAPI(createServerComponentSupabaseClient());
  // no need to select all the products
  // later implement WHERE in getProducts
  const products = await api.getProducts();

  return (
    <div className="grid content-start grid-cols-2 justify-center min-[560px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-7 w-full">
      <ProductList  products={products} />
    </div>
  );
}