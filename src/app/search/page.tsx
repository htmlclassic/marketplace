import { Suspense } from 'react';
import { SearchParams } from './types';
import Fetch from './Fetch';

interface PageProps {
  searchParams: SearchParams;
}

export default async function Page({ searchParams }: PageProps) {  
  const key = Object.entries(searchParams).join('');
  
  return (
    <Suspense fallback={<p>...Loading</p>} key={key}>
      <Fetch searchParams={searchParams} />
    </Suspense>
  );
}