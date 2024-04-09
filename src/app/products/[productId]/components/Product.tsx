'use client'

import PhotoGallery from '@/src/app/products/[productId]/components/PhotoGallery';
import Link from 'next/link';
import ChatButton from './ChatButton';
import AddToCartButton from '../../../../components/AddToCartButton';
import ManageFavoriteButton from '../../../../components/ManageFavoriteButton';
import { numberWithSpaces } from '@/src/utils';
import clsx from 'clsx';

import type { Product } from '../types';
import { useRef } from 'react';
import { Button } from '@/src/components/ui/button';
import { Badge } from "@/src/components/ui/badge";
import ProductCharacteristicList from './ProductCharacteristicList';
import Rating from '@/src/components/Rating';

interface ProductProps {
  product: NonNullable<Product>;
  Reviews: React.ReactNode;
  sellerName: string;
  uid: string | null;
}

export default function Product({
  uid,
  product,
  sellerName,
  Reviews,
}: ProductProps) {
  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const reviewsRef = useRef<HTMLDivElement | null>(null);
  const isFavorite = !!product.favorite_product.find(pr => pr.product_id === product.id);
  const reviewCount = product.review.length;

  return (
    <div className="product-mobile-grid lg:product-desktop-grid">
      <div className="[grid-area:header]">
        <h1 className="side-padding font-semibold text-xl max-w-6xl mb-3">{product.title}</h1>
        {
          uid &&
            <div className="side-padding">
              <ManageFavoriteButton isFavorite={isFavorite} productId={product.id} />
            </div>
        }
        <div className="side-padding flex items-center gap-5">
          <Rating value={getProductAvgRating(product)} readonly />
          <Button 
            variant="link" 
            className="p-0" 
            onClick={() => {
              reviewsRef.current?.scrollIntoView({
                behavior: "smooth"
              });
            }}
          >
            Отзывы ({reviewCount})
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 [grid-area:carousel-and-buttons]">
        <div className="sm:side-padding w-full">
          <PhotoGallery imgUrls={product.img_urls} />
        </div>
        <div className={clsx({
          "side-padding flex-col items-center gap-3 sm:flex-row flex": true,
        })}>
          <AddToCartButton
            product={product}
          />
          <ChatButton
            uid={uid}
            productOwnerId={product.owner}
            productId={product.id}
          />
        </div>
      </div>

      <div className="[grid-area:characteristics-short] side-padding hidden lg:block">
        <h2 className="text-base mb-7 font-medium">Характеристики</h2>
        <ProductCharacteristicList
          characteristics={product.product_characteristic}
          maxRows={7}
        />
        <Button 
          variant="link" 
          className="px-0 mt-5 hidden lg:flex" 
          onClick={() => {
            descriptionRef.current?.scrollIntoView({
              behavior: "smooth"
            });
          }}
        >
          Перейти к описанию
        </Button>
      </div>

      <div className="side-padding flex flex-col gap-3 [grid-area:info]">
        <p className="text-lg font-bold text-sky-600">{numberWithSpaces(product.price)} ₽</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Badge className="w-max p-0">
            <Link
                href={`/search?category=${product.category}`}
                className="p-2"
              >
                {product.category}
            </Link>
          </Badge>
          <div className="flex gap-3 text-sm items-center">
            {/* <span>Продавец</span> */}
            <Badge className="w-max sm:max-w-[500px] p-2 select-none flex gap-1 font-normal">
              <SellerIcon />
              Продавец:
              <span className="ml-1 line-clamp-1 font-medium">{sellerName}</span>
            </Badge>
          </div>
        </div>
      </div>

      <div className="side-padding mt-5 relative flex flex-col gap-7 [grid-area:description] mb-5">
        <h2 className="font-medium text-xl">Описание</h2>
        <div
          className="flex flex-col gap-3 max-w-6xl whitespace-pre-wrap"
        >
          {product.description}
        </div>

        <div
          ref={descriptionRef}  
          id="product_description"
          className="absolute left-0 -top-[calc(var(--header-height)+1rem)]"></div>
      </div>

      <div className="[grid-area:characteristics-full] side-padding mb-5">
        <h2 className="text-xl mb-7 font-medium">Характеристики</h2>
        <ProductCharacteristicList
          characteristics={product.product_characteristic}
          maxRows={Infinity}
        />
      </div>

      <div className="relative [grid-area:reviews] side-padding">
        { Reviews }
        <div
          ref={reviewsRef}  
          className="absolute left-0 -top-[calc(var(--header-height)+1rem)]"></div>
      </div>
    </div>
  );
}

function SellerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20" className="shrink-0">
      <g fill="currentColor">
        <path d="M12 10a4 4 0 100-8 4 4 0 000 8z"></path>
        <path d="M2.728 5.818a.75.75 0 10-1.455.364l.382 1.528a8.21 8.21 0 005.595 5.869v4.473c0 .898 0 1.648.08 2.242.084.628.27 1.195.726 1.65.455.456 1.022.642 1.65.726.595.08 1.344.08 2.242.08h.104c.899 0 1.648 0 2.243-.08.627-.084 1.194-.27 1.65-.726.455-.455.64-1.022.725-1.65.08-.594.08-1.344.08-2.242v-4.193a2.624 2.624 0 011.856 2.208l.65 5.52a.75.75 0 001.489-.175l-.65-5.52A4.124 4.124 0 0016 12.25H8.085A6.709 6.709 0 013.11 7.346l-.382-1.528z"></path>
      </g>
    </svg>
  );
}

function getProductAvgRating(product: Product) {
  if (!product || product.review.length === 0) return 0;

  const avgRating = product.review.reduce((acc, review) => acc + review.rating, 0) /
    product.review.length;

  return avgRating;
}