import { createServerComponentSupabaseClient } from '@/supabase/utils_server';
import { SearchParams } from './types';
import { loadProducts } from './utils';
import PageClient from './PageClient';

interface PageProps {
  searchParams: SearchParams;
}

export default async function Page({ searchParams }: PageProps) {  
  const supabase = createServerComponentSupabaseClient();
  const OFFSET = 19;

  const products = await loadProducts(supabase, searchParams, 0, OFFSET);
  
  return (
    <PageClient
      products={products}
      rangeFrom={OFFSET + 1}
    />
  );
}