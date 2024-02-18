'use client';

import { useState } from "react";
import ProductPreview from "../components/ProductPreview";
import { createClientSupabaseClient } from "@/supabase/utils_client";
import { useMotionValueEvent, useScroll } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import clsx from "clsx";

interface Props {
  products: Product[];
  offsetStart: number;
}

export default function ProductList({
  products: productsInitial,
  offsetStart: offsetStartInitial
}: Props) {
  const [products, setProducts] = useState(productsInitial)
  const { scrollYProgress } = useScroll()
  const [offsetStart, setOffsetStart] = useState(offsetStartInitial);
  const [shouldLoad, setShouldLoadMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const COUNT = offsetStartInitial;

  let itemList: React.ReactNode = <p>No items on sale yet.</p>;

  useMotionValueEvent(scrollYProgress, 'change', (scrollProgress) => {
    if (shouldLoad && !loading && scrollProgress > 0.8) {
      handleLoadMoreProducts();
    }
  })

  if (products.length) {
    const productsInStock = products.filter(pr => pr.quantity > 0);

    itemList = productsInStock.map((product) =>
      <div key={product.id}>
        <ProductPreview key={product.id} product={product} />
      </div>
    );
  }

  const handleLoadMoreProducts = async () => {
    setLoading(true);

    const supabase = createClientSupabaseClient();

    let { data: nextProducts } = await supabase
      .from('product')
      .select()
      .order('created_at', { ascending: false })
      .range(offsetStart, offsetStart + COUNT - 1);

    nextProducts = nextProducts ?? [];

    setOffsetStart(offsetStart + COUNT + 1);
    setProducts([
      ...products,
      ...nextProducts
    ]);
    setLoading(false);

    if (nextProducts.length < COUNT) {
      setShouldLoadMore(false);
    }
  };

  return (
    <>
      {itemList}
      <div className={clsx({
        "my-10": true,
        "hidden": !loading
      })}></div>
      <div
        className={clsx({
          "absolute bottom-5 left-1/2 -translate-x-1/2 w-8 h-8 text-sky-400": true,
          "hidden": !loading,
        })}
        title="Ещё больше товаров сейчас загружается"
      >
        <LoadingSpinner />
      </div>
    </>
  );
}