'use client';

import Image from 'next/image';
import Link from "next/link";
import ImgPlaceholder from "./noimage.jpg";
import { useState } from 'react';
import clsx from 'clsx';
import { numberWithSpaces } from '../utils';
import ImageShimmer from './ImageShimmer';

interface ProductProps {
  product: Product;
}

export default function ProductPreview({ product }: ProductProps) {
  const [imgIndex, setImgIndex] = useState(0);

  return (
    <Link
      href={`/products/${product.id}`}
      className="relative group/parent overflow-hidden space-y-2"
      onMouseLeave={() => setImgIndex(0)}
    >
      <div
        className="relative aspect-square group overflow-hidden rounded-lg"
      >
        {
          product.img_urls?.map((url, i) =>
            <Image
              src={url}
              fill
              sizes='600px'
              alt="Product picture"
              placeholder={ImageShimmer(300, 300)}
              className={clsx({
                "object-cover": true,
                "hidden": imgIndex !== i
              })}
              key={url}
            />
          )
        }
        {
          product.img_urls?.map((el, i, arr) =>
            <div
              style={{
                transform: `translateX(${i * 100}%)`,
                width: `${100 / arr.length}%`
              }}
              className="absolute top-0 left-0 h-full z-10 flex justify-center items-end pb-3"
              onMouseEnter={() => setImgIndex(i)}
              key={i}
            >
              {
                arr.length > 1 &&
                  <div className={clsx({
                    "w-[60%] h-[2px] shadow-[0_0_5px_1px_rgba(0,0,0,0.4)] transition-[background-color] invisible group-hover:visible": true,
                    "bg-sky-400": i === imgIndex,
                    "bg-white": i !== imgIndex
                  })}></div>
              }
            </div>
          )
        }
      </div>
      <div className="line-clamp-1 font-bold text-lg transition group-hover/parent:text-sky-500">
        {numberWithSpaces(product.price)} ₽
      </div>
      <div className="line-clamp-2 break-words transition group-hover/parent:text-sky-500">{product.title}</div>
    </Link>
  );
}