import Image from 'next/image';
import Link from "next/link";
import ImgPlaceholder from "./noimage.jpg";

interface ProductProps {
  product: Product;
}

export default function ProductPreview({ product }: ProductProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group/parent overflow-hidden space-y-2"
    >
      <div className="relative aspect-square">
        <Image
          src={product.img_urls ? product.img_urls[0] : ImgPlaceholder}
          fill
          sizes='600px'
          alt="Product picture"
          className="rounded-lg object-cover"
        />
      </div>
      <div className="line-clamp-1 font-bold transition group-hover/parent:text-sky-500">{product.price} ₽</div>
      <div className="line-clamp-2 break-words transition group-hover/parent:text-sky-500">{product.title}</div>
    </Link>
  );
}