import { motion } from "framer-motion";
import Image from "next/image";
import CartItemControls from "./CartItemControls/CartItemControls";

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
      className="flex items-center justify-between gap-3"
      key={product.id}
    >
      <div className="flex items-center gap-6">
        <Image
          src={product.img_urls![0]}
          alt="product photo"
          width={150}
          height={150}
        />
        <div className="max-w-lg flex flex-col justify-center gap-3">
          <div className="line-clamp-4">{product.title}</div>
          <div className="font-semibold line-clamp-1">{product.price} ₽</div>
        </div>
      </div>
      <CartItemControls
        quantity={cartItem.quantity}
        maxQuantity={cartItem.maxQuantity}
        setItemQuantity={setItemQuantity}
        removeCartItem={removeCartItem}
      />
    </motion.div>
  );
}