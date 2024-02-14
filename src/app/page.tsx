import { createServerComponentSupabaseClient } from '../../supabase/utils_server';
import ProductList from './ProductList';

export default async function Catalog() {
  const supabase = createServerComponentSupabaseClient();
  const LIMIT = 25;
  
  const { data: products } = await supabase
    .from('product')
    .select()
    .limit(LIMIT)
    .order('created_at', { ascending: true });

  return (
    <>
      <div className="top-margin side-padding grid gap-3 sm:gap-5 content-start grid-cols-2 justify-center min-[560px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 w-full">
        <ProductList products={products ?? []} offsetStart={LIMIT} />
      </div>
    </>
  );
}