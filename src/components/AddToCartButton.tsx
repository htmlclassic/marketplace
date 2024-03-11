'use client';

import EastIcon from '@mui/icons-material/East';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Button from "@/src/components/Button";
import { CartContext } from "@/src/CartContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import clsx from "clsx";

interface Props {
  product: Product;
  className?: string;
}

export default function AddToCartButton({
  product,
  className = ''
}: Props) {
  const cartContext = useContext(CartContext);
  const router = useRouter();

  const itemInCartInitial = Boolean( cartContext.cart.find(item => item.product.id === product.id) );
  const [inCart, setInCart] = useState(itemInCartInitial);

  useEffect(() => {
    if (itemInCartInitial !== inCart) {
      setInCart(itemInCartInitial);
    }
  }, [itemInCartInitial]);

  const handleClick = () => {
    if (inCart) {
      router.push('/cart');
    } else {
      cartContext.addItem({
        quantity: 1,
        product: product
      });

      setInCart(true);
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={clsx({
        [className]: className,
        "group": true,
        "bg-sky-400": !inCart,
        "bg-sky-500": inCart
      })}
    >
      {
        inCart
          ? 
            <span className="flex items-center justify-center gap-3">
              <span>В корзине</span>
              <ShoppingCartIcon sx={{ width: 18, height: 18 }} />
            </span>
          :
            'В корзину'
      }
    </Button>
  );
}