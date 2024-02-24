'use client';

import Image from "next/image";
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { OrderSearchParam, ProductsWithRating, SearchParams } from "../types";
import Rating from "@/src/components/Rating";
import AddToCartButton from "@/src/components/AddToCartButton";
import Link from "next/link";
import { createClientSupabaseClient } from "@/supabase/utils_client";
import { loadProducts } from "../utils";
import { useLazyLoad } from "../../hooks";

interface Props {
  products: ProductsWithRating;
  rangeFrom: number;
}

export default function ProductList({
  products: productsInitial,
  rangeFrom: rangefromInitial
}: Props) {
  const supabase = createClientSupabaseClient();
  const searchParams = useSearchParams();
  const params: SearchParams = {
    text: searchParams.get('text') as string | undefined,
    order: searchParams.get('order') as OrderSearchParam | undefined,
    price_from: searchParams.get('price_from') as string | undefined,
    price_to: searchParams.get('price_to') as string | undefined
  };

  const [products, setProducts] = useState(productsInitial || []);
  const [rangeFrom, setRangeFrom] = useState(rangefromInitial);
  const [shouldLoad, setShouldLoad] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMoreProducts = async () => {
    if (!shouldLoad || loading) return;

    setLoading(true);

    const ITEMS_TO_FETCH_COUNT = 20;
    const rangeTo = rangeFrom + ITEMS_TO_FETCH_COUNT - 1;

    const nextProducts = await loadProducts(supabase, params, rangeFrom, rangeTo);

    if (nextProducts) {
      setProducts([ ...products, ...nextProducts ]);

      if (nextProducts.length < ITEMS_TO_FETCH_COUNT) setShouldLoad(false);
    }
    
    setRangeFrom(rangeTo + 1);
    setLoading(false);
  };

  useLazyLoad(loadMoreProducts);

  useEffect(() => {
    if (products !== productsInitial && productsInitial) {
      setProducts(productsInitial);
      setRangeFrom(rangefromInitial);
      setShouldLoad(true);

      console.log(123);
    }
  }, [productsInitial]);

  if (!products?.length) {
    return (
      <p className="w-max">К сожалению мы не нашли совпадений.</p>
    );
  }

  return(
    <div className="flex flex-col gap-7">
      { 
        products.map(product => {
          const reviews = product.review ?? [];

          const avgRating =
            (( reviews.reduce((acc, review) => review.rating + acc, 0) / reviews.length ) || 0)

          return (
            <div 
              className="flex flex-col sm:flex-row gap-5 justify-between"
              key={product.id}
            >
              <div className="flex gap-5 flex-grow">
                <Link
                  href={`/products/${product.id}`}
                  className="shrink-0"
                >
                  <Image
                    src={product.img_urls?.[0] || ''}
                    alt=""
                    width={130}
                    height={130}
                    className="rounded-lg"
                  />
                </Link>
                <div className="flex flex-col py-2 gap-3 justify-between flex-grow">
                  <div className="line-clamp-3 text-sm sm:text-base"
                  >
                    {product.title}</div>
                  <div className="flex items-center gap-3">
                    <Rating value={avgRating} readonly />
                    <span className="text-sm">{reviews.length}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between py-2 gap-3 shrink-0 sm:w-[180px]">
                <div className="flex-shrink-0">{product.price} ₽</div>
                <AddToCartButton
                  product={product}
                  className="text-sm py-2 px-4 max-w-[180px]"
                />
              </div>
            </div>
          );
        })
      }
    </div>
  );
}