'use client';

import Image from "next/image";
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { getProducts } from "../utils_server";
import { FilterSearchParam, OrderSearchParam } from "../types";
import Rating from "@/src/components/Rating";
import ManageFavoriteButton from "@/src/components/ManageFavoriteButton";
import AddToCartButton from "@/src/components/AddToCartButton";
import Link from "next/link";

type ProductsWithRating = Awaited<ReturnType<typeof getProducts>>;

interface Props {
  products: ProductsWithRating;
}

export default function ProductList({ products }: Props) {
  const searchParams = useSearchParams();
  const order = searchParams.get('order') as OrderSearchParam | null;
  const priceFrom = searchParams.get('price_from') as FilterSearchParam | null;
  const priceTo = searchParams.get('price_to') as FilterSearchParam | null;

  let list: React.ReactNode = <p className="w-max">К сожалению мы не нашли совпадений.</p>

  if (products?.length) {
    // replace it with sql expression in page
    if (priceFrom && priceTo) {
      products = products.filter(product => product.price)
    }

    if (order) {
      if (order === 'price_asc') {
        products.sort((product1, product2) => product1.price - product2.price);
      }
      if (order === 'price_desc') {
        products.sort((product1, product2) => product2.price - product1.price);
      }
      if (order === 'rating_desc') {
        products.sort((product1, product2) => getAvgRating(product2) - getAvgRating(product1));
      }
    }

    list =
      <div className="flex flex-col gap-7">
        { 
          products.map(pr => {
            const avgRating =
              ( pr.review.reduce((acc, review) => review.rating + acc, 0) / pr.review.length ) || 0;

            return (
              <div 
                className="flex flex-col sm:flex-row gap-5"
                key={pr.id}
              >
                <div className="flex gap-5 flex-grow">
                  <Link
                    href={`/products/${pr.id}`}
                    className="shrink-0"
                  >
                    <Image
                      src={pr.img_urls?.[0] || ''}
                      alt=""
                      width={130}
                      height={130}
                      className="rounded-lg"
                    />
                  </Link>
                  <div className="flex flex-col py-2 gap-3 justify-between flex-grow">
                    <div className="max-w-[700px] line-clamp-3 text-sm sm:text-base"
                    >
                      {pr.title}</div>
                    <div className="flex items-center gap-3">
                      <Rating value={avgRating} readonly />
                      <span className="text-sm">{pr.review.length}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between py-2 gap-3 shrink-0 sm:w-[180px]">
                  <div className="flex-shrink-0">{pr.price} ₽</div>
                  <AddToCartButton
                    product={pr}
                    className="text-sm py-2 px-4 max-w-[180px]"
                  />
                </div>
              </div>
            );
          })
        }
      </div>;
  }

  return list;
}

// extracts array's elements' type
type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type ProductWithRating = ArrayElement<Exclude<ProductsWithRating, null>>;

function getAvgRating(product: ProductWithRating) {
  if (!product) return 0;

  const avgRating =
    ( product.review.reduce((acc, review) => review.rating + acc, 0) / product.review.length ) || 0;

  return avgRating;
}