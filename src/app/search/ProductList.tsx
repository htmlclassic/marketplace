'use client';

import ProductPreview from '@/src/components/ProductPreview';
import { useSearchParams } from 'next/navigation';
import React from 'react';

interface Props {
  products: Product[] | null;
}

export default function ProductList({ products }: Props) {
  const searchParams = useSearchParams();
  const text = searchParams.get('text');
  const category = searchParams.get('category');

  let list: React.ReactNode = <p className="w-max">К сожалению мы не нашли совпадений :(</p>

  if (products) {
    const filteredProducts = products.filter(product => {
      if (product.quantity < 1) return false;

      if (text && category) {        
        return (
          product.title.toLowerCase().includes(text.toLocaleLowerCase()) &&
          product.category.toLowerCase() === category.toLocaleLowerCase()
        );
      } else if (text) {
        return product.title.toLowerCase().includes(text.toLocaleLowerCase());
      } else if (category) {
        return product.category.toLowerCase() === category.toLocaleLowerCase();
      }
    });

    if (filteredProducts.length) {
      list = filteredProducts.map(pr => <ProductPreview key={pr.id} product={pr} />)
    }
  }

  return list;
}
