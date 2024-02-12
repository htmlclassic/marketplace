import PageClient from './PageClient';
import { getProducts } from './utils_server';

type Params = 'text' | 'order' | 'price_from' | 'price_to';

interface PageProps {
  searchParams: { [Key in Params]: string | undefined };
}

export default async function Page({ searchParams }: PageProps) {  
  const text = searchParams.text;
  const priceFrom = searchParams.price_from;
  const priceTo = searchParams.price_to;

  const products = await getProducts(text, priceFrom, priceTo);

  return <PageClient products={products} />
}