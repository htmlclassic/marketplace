import { createServerComponentSupabaseClient } from '../../supabase/utils_server';
import ProductList from './ProductList';

export default async function Catalog() {
  const supabase = createServerComponentSupabaseClient();
  const LIMIT = 21;
  
  const { data: products } = await supabase
    .from('product')
    .select()
    .limit(LIMIT)
    .order('created_at', { ascending: false });
  
  return (
    <>
      <div className="relative top-margin side-padding grid gap-3 sm:gap-5 content-start grid-cols-2 justify-center min-[560px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 w-full">
        <ProductList products={products ?? []} offsetStart={LIMIT} />
      </div>
    </>
  );
}