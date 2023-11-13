import noImage from "@/src/components/noimage.jpg";
import Image from "next/image";
import DeleteCartItemButton from "./DeleteCartItemButton";
import ControlQuantity from "./ControlQuantity";
import { CartState } from "../page";

interface Props {
  product: Product;
  cartItem: CartState;
  handleDeleteProduct: () => void;
  setItemQuantity: (newQuantity: number) => void;
}

export default function Item({
  product,
  cartItem,
  handleDeleteProduct,
  setItemQuantity
}: Props) {
  const imgSrc = product.imageUrls?.[0];

  return (
    <article key={product.id} className="flex flex-col sm:items-center gap-5 sm:flex-row sm:justify-between">
      <div className="flex items-center gap-5 sm:flex-nowrap">
        <div className="w-[150px] h-[150px] relative shrink-0">
          <Image
            src={imgSrc || noImage}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-3 max-w-xl text-sm">
          <div className="font-bold sm:line-clamp-2">{product.title}</div>
          <div className="font-bold text-sky-600 text-lg">{product.price} ₽</div>
        </div>
      </div>
      <div className="flex shrink-0">
        <DeleteCartItemButton productId={product.id} handleDeleteProduct={handleDeleteProduct} />
        <ControlQuantity cartItem={cartItem} setItemQuantity={setItemQuantity} />
      </div>
    </article>
  );
}