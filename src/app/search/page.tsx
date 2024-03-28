import { createServerComponentSupabaseClient } from '@/supabase/utils_server';
import { SearchParams } from './types';
import { getCategories, loadProducts } from './utils';
import PageClient from './PageClient';

interface PageProps {
  searchParams: SearchParams;
}

export default async function Page({ searchParams }: PageProps) {  
  const supabase = createServerComponentSupabaseClient();
  const FETCH_COUNT = 20;

  const categories = await getCategories(supabase);
  const products = await loadProducts(supabase, searchParams, 0, FETCH_COUNT - 1);

  return (
    <PageClient
      products={products}
      rangeFrom={FETCH_COUNT}
    />
  );
}