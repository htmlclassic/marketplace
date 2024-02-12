import { motion } from "framer-motion";
import Image from "next/image";
import CartItemControls from "./CartItemControls/CartItemControls";
import Link from "next/link";

interface Props {
  cartItem: CartItem;
  product: Product;
  removeCartItem: () => void;
  setItemQuantity: (newQuantity: number) => void;
}

export default function Item({
  product,
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
      key={product.id}
    >
      <Link
        href={`/products/${product.id}`}
        className="flex items-center gap-6"
      >
        <Image
          src={product.img_urls![0]}
          alt="product photo"
          width={150}
          height={150}
          className="rounded-md"
        />
        <div className="max-w-lg flex flex-col justify-center gap-3">
          <div className="line-clamp-4 [overflow-wrap:anywhere]">{product.title}</div>
          <div className="font-semibold line-clamp-1">{product.price} ₽</div>
        </div>
      </Link>
      <CartItemControls
        quantity={cartItem.quantity}
        maxQuantity={cartItem.maxQuantity}
        setItemQuantity={setItemQuantity}
        removeCartItem={removeCartItem}
      />
    </motion.div>
  );
}