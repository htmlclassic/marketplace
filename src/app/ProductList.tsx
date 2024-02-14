'use client';

import { useEffect, useRef, useState } from "react";
import ProductPreview from "../components/ProductPreview";
import { createClientSupabaseClient } from "@/supabase/utils_client";
import { motion, useInView } from "framer-motion";

interface Props {
  products: Product[];
  offsetStart: number;
}

export default function ProductList({ products: productsInitial, offsetStart: offsetStartInitial }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref);

  const [products, setProducts] = useState(productsInitial)
  const [offsetStart, setOffsetStart] = useState(offsetStartInitial);
  const COUNT = 25;

  let itemList: React.ReactNode = <p>No items on sale yet.</p>;

  if (products.length) {
    const productsInStock = products.filter(pr => pr.quantity > 0);

    itemList = productsInStock.map((product, index) =>
      <motion.div
        key={product.id}
        initial={{
          scale: index > offsetStartInitial - 1 ? 0 : 1
        }}
        animate={{
          scale: 1
        }}
      >
        <ProductPreview key={product.id} product={product} />
      </motion.div>
    );
  }

  const handleLoadMoreProducts = async () => {
    const supabase = createClientSupabaseClient();

    let { data: newProducts } = await supabase
      .from('product')
      .select()
      .order('created_at', { ascending: true })
      .range(offsetStart, offsetStart + COUNT);

    newProducts = newProducts ?? [];

    setOffsetStart(offsetStart + COUNT + 1);
    setProducts([
      ...products,
      ...newProducts
    ]);
  };

  useEffect(() => {
    if (isInView) {
      handleLoadMoreProducts();
    }
  }, [isInView])

  return (
    <>
      {itemList}
      <div ref={ref}></div>
    </>
  );
}