'use client';

import { useContext } from "react";
import ItemList from "./components/ItemList";
import EmptyCart from "./components/EmptyCart";
import { CartContext } from "@/src/CartContext";
import CartDetails from "./components/CartDetails";

export default function PageClient() {
  const { cart } = useContext(CartContext);

  if (!cart.length) return <EmptyCart />

  return (
    <div className="relative max-w-[1600px] mx-auto grow flex gap-5 flex-col lg:flex-row lg:justify-between lg:gap-10 side-padding top-margin">
      <ItemList />
      <CartDetails />
    </div>
  );
}