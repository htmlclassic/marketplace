'use client';

import ProductPreview from "../components/ProductPreview";
import { createClientSupabaseClient } from "@/supabase/utils_client";
import { useLazyLoad } from "./hooks";

import { useInfiniteQuery } from '@tanstack/react-query'
import { PRODUCTS_TO_FETCH_COUNT } from "./constants";
import { ReloadIcon } from "@radix-ui/react-icons";
import clsx from "clsx";

interface Props {
  products: Product[];
}

export default function ProductList({ products: productsInitial }: Props) {
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({ 
    queryKey: ['products'], 
    queryFn: loadProducts,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: false
  });

  const newProducts = data?.pages.map(page => page.products).flat();
  let products = productsInitial;

  if (newProducts) {
    products = [...products, ...newProducts];
  }

  let itemList: React.ReactNode = <p>No items on sale yet.</p>;

  if (products.length) {
    itemList = products.map((product) =>
      <div key={product.id}>
        <ProductPreview key={product.id} product={product} />
      </div>
    );
  }

  useLazyLoad(() => {
    if (!isFetchingNextPage) fetchNextPage();
  });

  return (
    <div className="top-margin side-padding">
      <div className="grid gap-3 sm:gap-5 content-start grid-cols-2 justify-center min-[560px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 w-full">
        {itemList}
      </div>
      <div className="flex justify-center h-[80px] relative">
        <div className={clsx({
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2": true,
          "hidden": !isFetchingNextPage,
          "block": isFetchingNextPage
        })}>
          <ReloadIcon className="animate-spin-fast w-[40px] h-[40px]" />
        </div>
      </div>
    </div>
  );
}

async function loadProducts({ pageParam }: { pageParam: number }) {
  const supabase = createClientSupabaseClient();
  const from = pageParam * PRODUCTS_TO_FETCH_COUNT;
  const to = from + PRODUCTS_TO_FETCH_COUNT - 1;

  const { data: products, error } = await supabase
    .from('product')
    .select()
    .gt('quantity', 0)
    .order('created_at', { ascending: false })
    .range(from, to);

  const nextPage = products?.length === PRODUCTS_TO_FETCH_COUNT ? pageParam + 1 : null;

  if (error) throw new Error(error.message);

  return {
    products,
    nextPage
  };
}