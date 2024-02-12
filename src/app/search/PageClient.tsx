'use client';

import { getProducts } from "./utils_server";
import Filters from './components/Filters';
import ProductList from './components/ProductList';
import Sort from './components/Sort';
import { useState } from "react";

type ProductsWithRating = Awaited<ReturnType<typeof getProducts>>;

interface Props {
  products: ProductsWithRating;
}

export default function PageClient({ products }: Props) {
  const [showFilters, setShowFilters] = useState<boolean | null>(null);

  return (
    <div
      className="grow mx-auto flex justify-center items-start max-w-[1600px]"
    >
      <Filters show={showFilters} />
      <div className="p-3 pt-0">
        <Sort setShowFilters={setShowFilters} />
        <ProductList products={products} />
      </div>
    </div>
  );
}