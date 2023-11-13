'use client';

import ProductPreview from '@/src/components/ProductPreview';
import { useSearchParams } from 'next/navigation';
import React from 'react';

interface Props {
  products: Product[] | null;
}

export default function ProductList({ products }: Props) {
  const searchParams = useSearchParams();
  const targetText = searchParams.get('text')!.toLocaleLowerCase();

  let list: React.ReactNode = <p>К сожалению мы не нашли совпадений :(</p>

  if (products) {
    const filteredProducts = products.filter(product => 
      product.quantity &&
      product.title.toLowerCase().includes(targetText)
    );

    if (filteredProducts.length) {
      list = filteredProducts.map(pr => <ProductPreview key={pr.id} product={pr} />)
    }
  }

  return list;
}
