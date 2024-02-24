import { createServerComponentSupabaseClient } from '@/supabase/utils_server';
import PageClient from './PageClient';
import { SearchParams } from './types';
import { loadProducts } from './utils';

interface FetchProps {
  searchParams: SearchParams;
}

export default async function Fetch({ searchParams }: FetchProps) {  
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