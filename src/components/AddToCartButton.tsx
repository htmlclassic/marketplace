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
  className?: string;
}

export default function AddToCartButton({
  productId,
  productPrice,
  maxQuantity,
  className = ''
}: Props) {
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
        [className]: className,
        "bg-sky-400": !inCart,
        "bg-sky-500": inCart
      })}
    >
      {
        inCart
          ? 
            <div className="w-full flex items-center justify-center gap-5">
              <span>В корзине</span>
              <span
                onClick={e => {
                  e.stopPropagation();

                  cartContext.removeItem(productId);
                  setInCart(false);
                }}
                title="Удалить из корзины"
                className="h-full transition-all hover:bg-opacity-20 hover:bg-white scale-[1.2]"
              ><TrashIcon /></span>
            </div>
          :
            'В корзину'
      }
    </Button>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M18 6l-.8 12.013c-.071 1.052-.106 1.578-.333 1.977a2 2 0 01-.866.81c-.413.2-.94.2-1.995.2H9.994c-1.055 0-1.582 0-1.995-.2a2 2 0 01-.866-.81c-.227-.399-.262-.925-.332-1.977L6 6M4 6h16m-4 0l-.27-.812c-.263-.787-.394-1.18-.637-1.471a2 2 0 00-.803-.578C13.938 3 13.524 3 12.694 3h-1.388c-.829 0-1.244 0-1.596.139a2 2 0 00-.803.578c-.243.29-.374.684-.636 1.471L8 6"
      ></path>
    </svg>
  );
}