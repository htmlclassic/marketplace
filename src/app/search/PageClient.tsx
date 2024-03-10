'use client';

import Filters from './components/Filters';
import ProductList from './components/ProductList';
import Sort from './components/Sort';
import { useEffect, useState } from "react";
import { throttle } from "lodash";
import clsx from "clsx";
import { Categories, ProductsWithAvgRating } from './types';

interface Props {
  products: ProductsWithAvgRating;
  rangeFrom: number;
}

export default function PageClient({
  products, 
  rangeFrom,
}: Props) {
  const [showFilters, setShowFilters] = useState<boolean | null>(null);

  useEffect(() => {
    const handleResize = throttle(() => {
      if (!showFilters && window.innerWidth > 640) {
        setShowFilters(true);
      }
    }, 500);

    window.addEventListener('resize', handleResize);

    if (window.innerWidth > 640) setShowFilters(true);
    else setShowFilters(false);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="relative grow mx-auto flex flex-col max-w-[1600px] [--menu-height:3rem]"
    >
      <div 
        onClick={() => setShowFilters(!showFilters)}
        className="sm:hidden h-[--menu-height] sticky top-[var(--header-height)] bg-white z-50 cursor-pointer flex gap-3 items-center side-padding"
      >
        <span className={clsx({
          "transition-all text-2xl": true,
          "rotate-90": showFilters,
          "rotate-0": !showFilters
        })}>
          ≡
        </span><span>Меню</span>
      </div>
      <div className="flex p-2">
        <Filters
          show={showFilters}
        />
        <div className="pt-0 w-full">
          <Sort />
          <ProductList products={products} rangeFrom={rangeFrom} />
        </div>
      </div>
    </div>
  );
}