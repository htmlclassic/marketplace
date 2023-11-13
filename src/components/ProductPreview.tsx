import Image from 'next/image';
import Link from "next/link";
import ImgPlaceholder from "./noimage.jpg";

interface ProductProps {
  product: Product;
}

export default function ProductPreview({ product }: ProductProps) {
  const outOfStock = product.quantity === 0;

  return (
    <div className="flex flex-col gap-3 relative">
      {
        outOfStock &&
        <div className="absolute rounded-lg bg-black bg-opacity-60 backdrop-blur-[2px] w-full h-full z-10 text-white flex justify-center items-center select-none">Out of stock</div>
      }
      <Link href={`/products/${product.id}`}>
        <div className="group/parent max-h-[380px] overflow-hidden space-y-2">
          <div className="relative h-[260px]">
            <Image
              src={product.imageUrls ? product.imageUrls[0] : ImgPlaceholder}
              fill
              alt="Product picture"
              className="rounded-lg object-cover"
            />
          </div>
          <div className="line-clamp-1 font-bold transition group-hover/parent:text-sky-500">{product.price} ₽</div>
          <div className="line-clamp-2 break-words transition group-hover/parent:text-sky-500">{product.title}</div>
        </div>
      </Link>
    </div>
  );
}