'use client';

import Button from "@/src/components/Button";
import { CartContext } from "@/src/CartContext";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

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
      className="bg-sky-400"
    >
      {
        inCart ? 'В корзине' : 'Добавить в корзину'
      }
    </Button>
  );
}