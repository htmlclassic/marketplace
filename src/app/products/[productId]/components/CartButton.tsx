'use client';

import Button from "@/src/components/Button";
import { CartContext } from "@/src/CartContext";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import clsx from "clsx";

interface Props {
  productId: string;
  productPrice: number;
  maxQuantity: number;
}

export default function CartButton({ productId, productPrice , maxQuantity }: Props) {
  const cartContext = useContext(CartContext);
  const router = useRouter();

  const itemInCartInitial = Boolean( cartContext.cart.find(item => item.product_id === productId) );
  const [inCart, setInCart] = useState(itemInCartInitial);

  const handleClick = () => {
    if (inCart) {
      router.push('/cart');
    } else {
      cartContext.addItem({
        product_id: productId,
        price: productPrice,
        quantity: 1,
        maxQuantity
      });

      setInCart(true);
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={clsx({
        "bg-sky-400": !inCart,
        "bg-sky-500": inCart
      })}
    >
      {
        inCart
          ? 
            <div>
              <span>В корзине</span>
              <span
                onClick={e => {
                  e.stopPropagation();

                  cartContext.removeItem(productId);
                  setInCart(false);
                }}
                className="p-3 border transition-all hover:bg-opacity-20 hover:bg-white "
              >D</span>
            </div>
          :
            'Добавить в корзину'
      }
    </Button>
  );
}