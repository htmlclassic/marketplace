'use client';

import ProductPreview from '@/src/components/ProductPreview';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { Rating } from './page';

interface Props {
  products: Product[] | null;
  rating: Rating[];
}

export default function ProductList({ products, rating }: Props) {
  const searchParams = useSearchParams();
  const text = searchParams.get('text');
  const orderBy = searchParams.get('filter') as SearchFilter | null;
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
      switch(orderBy) {
        case 'price_desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating_desc':
          // refactor it to make it simpler
          filteredProducts.sort((a, b) =>
            rating.find(productRating => productRating.productId === a.id)!.avgRating -
            rating.find(productRating => productRating.productId === b.id)!.avgRating
          );
          break;
        default:
          filteredProducts.sort((a, b) => a.price - b.price);
      }

      list = filteredProducts.map(pr => <ProductPreview key={pr.id} product={pr} />)
    }
  }

  return list;
}
