'use client'

import Carousel from '@/src/components/Carousel';
import Image from 'next/image';
import ImgPlaceholder from '@/src/components/noimage.jpg'
import Link from 'next/link';
import ChatButton from './ChatButton';
import AddToCartButton from '../../../../components/AddToCartButton';
import ManageFavoriteButton from '../../../../components/ManageFavoriteButton';
import { numberWithSpaces } from '@/src/utils';
import clsx from 'clsx';

import type { Product } from '../types';
import { useRef } from 'react';
import { Button } from '@/src/components/ui/button';
import ProductCharacteristicList from './ProductCharacteristicList';

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
  const isFavorite = !!product.favorite_product.find(pr => pr.product_id === product.id);

  let imageList: React.ReactNode = 
    <Image
      src={ImgPlaceholder}
      alt="photo of a product"
      className="object-cover"
      fill
      sizes="2000px"
      priority
    />;

  if (product.img_urls) {
    imageList = 
      product.img_urls.map(imgUrl =>
        <Image
          key={imgUrl}
          src={imgUrl}
          alt="photo of a product"
          className="object-cover"
          fill
          sizes="2000px"
          priority
        />
      );
  }

  return (
    <div className="product-mobile-grid lg:product-desktop-grid">
      <div className="[grid-area:header]">
        <h1 className="side-padding font-semibold text-xl max-w-6xl sm:mb-3">{product.title}</h1>
        {
          uid &&
            <div className="side-padding">
              <ManageFavoriteButton isFavorite={isFavorite} productId={product.id} />
            </div>
        }
      </div>

      <div className="flex flex-col gap-3 [grid-area:carousel-and-buttons]">
        <div className="sm:side-padding w-full">
          <Carousel>{ imageList }</Carousel>
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
        <p className="flex gap-5 items-center">
          Категория:
          <Link
            href={`/search?category=${product.category}`}
            className="border rounded-3xl p-2 transition-all hover:border-slate-400"
          >
            {product.category}
          </Link>
        </p>
        <p>Продавец: <span className="font-semibold">{sellerName}</span></p>
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

      <div className="[grid-area:reviews] side-padding">
        { Reviews }
      </div>
    </div>
  );
}