import { motion } from "framer-motion";
import Image from "next/image";
import CartItemControls from "./CartItemControls/CartItemControls";
import Link from "next/link";
import { numberWithSpaces } from "@/src/utils";

interface Props {
  cartItem: CartItem;
  removeCartItem: () => void;
  setItemQuantity: (newQuantity: number) => void;
}

export default function Item({
  cartItem,
  removeCartItem,
  setItemQuantity
}: Props) {
  return (
    <motion.div
      layout
      transition={{
        layout: { duration: 0.15 }
      }}
      exit={{
        x: '-100vw',
        transition: {
          duration: 0.07
        }
      }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      key={cartItem.product.id}
    >
      <Link
        href={`/products/${cartItem.product.id}`}
        className="flex items-center gap-6"
      >
        <div className="relative w-[150px] h-[150px] shrink-0">
          <Image
            src={cartItem.product.img_urls?.[0] || ''}
            alt={`Photo of a product with title: ${cartItem.product.title}`}
            fill
            className="rounded-md object-cover"
          />
        </div>
        <div className="max-w-lg flex flex-col justify-center gap-3">
          <div className="line-clamp-4 [overflow-wrap:anywhere]">{cartItem.product?.title}</div>
          <div className="font-semibold line-clamp-1">{numberWithSpaces(cartItem.product?.price)} ₽</div>
        </div>
      </Link>
      <CartItemControls
        quantity={cartItem.quantity}
        maxQuantity={cartItem.product.quantity}
        setItemQuantity={setItemQuantity}
        removeCartItem={removeCartItem}
      />
    </motion.div>
  );
}