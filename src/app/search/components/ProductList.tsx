'use client';

import Image from "next/image";
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { OrderSearchParam, SearchParams, ProductsWithAvgRating } from "../types";
import Rating from "@/src/components/Rating";
import AddToCartButton from "@/src/components/AddToCartButton";
import Link from "next/link";
import { createClientSupabaseClient } from "@/supabase/utils_client";
import { loadProducts } from "../utils";
import { useLazyLoad } from "../../hooks";
import MainLoadingSpinner from "@/src/components/MainLoadingSpinner";

interface Props {
  products: ProductsWithAvgRating;
  rangeFrom: number;
}

export default function ProductList({
  products: productsInitial,
  rangeFrom: rangefromInitial
}: Props) {
  const supabase = createClientSupabaseClient();
  const router = useRouter();

  const searchParams = useSearchParams();
  const initialSearchParams = useRef(searchParams);
  const params: SearchParams = {
    text: searchParams.get('text') as string | undefined,
    category: searchParams.get('category') as string | undefined,
    order: searchParams.get('order') as OrderSearchParam | undefined,
    price_from: searchParams.get('price_from') as string | undefined,
    price_to: searchParams.get('price_to') as string | undefined
  };

  const [products, setProducts] = useState(productsInitial || []);

  const [rangeFrom, setRangeFrom] = useState(rangefromInitial);
  const [shouldLoad, setShouldLoad] = useState(true);
  const [firstBatchLoading, setFirstBatchLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleLoadProducts = async () => {
    if (!shouldLoad || loadingMore) return;

    setLoadingMore(true);

    const ITEMS_TO_FETCH_COUNT = 20;
    const rangeTo = rangeFrom + ITEMS_TO_FETCH_COUNT - 1;

    const nextProducts = await loadProducts(supabase, params, rangeFrom, rangeTo);

    if (nextProducts) {
      setProducts([ ...products, ...nextProducts ]);

      if (nextProducts.length < ITEMS_TO_FETCH_COUNT) setShouldLoad(false);
    }
    
    setRangeFrom(rangeTo + 1);
    setLoadingMore(false);
  };

  useLazyLoad(handleLoadProducts);

  useEffect(() => {
    if (initialSearchParams.current === searchParams) return;

    setFirstBatchLoading(true);

    (async () => {
      const RANGE_TO = 20;

      const products = await loadProducts(supabase, params, 0, RANGE_TO);

      setProducts(products!);
      setRangeFrom(RANGE_TO + 1);
      setShouldLoad(true);
      setFirstBatchLoading(false);
    })();
  }, [searchParams]);

  if (!products?.length) {
    return (
      <p className="w-max">К сожалению мы не нашли совпадений.</p>
    );
  }

  if (firstBatchLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <MainLoadingSpinner />
      </div>
    );
  }

  return(
    <div className="flex flex-col gap-7">
      { 
        products.map(product =>
          <div
            className="flex flex-col sm:flex-row gap-5 justify-between"
            key={product.id}
          >
            <Link
              href={`/products/${product.id}`}
              className="flex gap-5 flex-grow relative shrink-0 w-[130px] h-[130px]"
            >
              <div
                className="relative shrink-0 w-[130px] h-[130px] -z-10"
              >
                <Image
                  src={product.img_urls?.[0] || ''}
                  alt=""
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex flex-col py-2 gap-3 justify-between flex-grow">
                <div className="line-clamp-3 text-sm sm:text-base"
                >
                  {product.title}</div>
                <div className="flex items-center gap-3">
                  <Rating value={product.avg_rating ?? 0} readonly />
                </div>
              </div>
            </Link>
            <div
              className="flex flex-row sm:flex-col items-center sm:items-end justify-between py-2 gap-3 shrink-0 sm:w-[180px]"
            >
              <div className="flex-shrink-0">{product.price} ₽</div>
              <AddToCartButton
                product={product}
                className="text-sm py-2 px-4 max-w-[180px]"
              />
            </div>
          </div>
        )
      }
    </div>
  );
}