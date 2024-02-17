'use client'

import Slider from '@/src/components/Slider';
import Image from 'next/image';
import ImgPlaceholder from '@/src/components/noimage.jpg'
import Link from 'next/link';
import ChatButton from './ChatButton';
import AddToCartButton from '../../../../components/AddToCartButton';
import ManageFavoriteButton from '../../../../components/ManageFavoriteButton';
import { numberWithSpaces } from '@/src/utils';
import clsx from 'clsx';

interface ProductProps {
  product: Product;
  Reviews: React.ReactNode;
  sellerName: string;
  uid: string | null;
  isFavorite: boolean;
}

export default function Product({
  uid,
  product,
  sellerName,
  Reviews,
  isFavorite
}: ProductProps) {
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
    <div className="flex flex-col gap-5">
      <h1 className="side-padding font-semibold text-xl max-w-6xl order-1 sm:mb-3 sm:order-none">{product.title}</h1>
      {
        uid &&
          <div className="side-padding">
            <ManageFavoriteButton isFavorite={isFavorite} productId={product.id} />
          </div>
      }
      <div className="flex-col gap-5 w-max contents sm:flex">
        <div className='sm:side-padding'>
          <Slider>{ imageList }</Slider>
        </div>
        <div className={clsx({
          "side-padding order-2 flex-col items-center gap-3 sm:flex-row flex": true,
          "max-w-[400px]": !uid
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
      <div className="side-padding flex flex-col gap-5 order-2">
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
        <p>Продавец: <span className="font-bold">{sellerName}</span></p>
      </div>
      <div className="side-padding order-last flex flex-col gap-5">
        <h2 className="font-semibold text-xl">Описание</h2>
        <p className="flex flex-col gap-3 max-w-6xl border-b pb-5">
          <span>{product.description}</span>
        </p>
        { Reviews }
      </div>
    </div>
  );
}