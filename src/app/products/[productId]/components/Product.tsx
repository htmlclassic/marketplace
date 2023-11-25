import Slider from '@/src/components/Slider';
import Image from 'next/image';
import ImgPlaceholder from '@/src/components/noimage.jpg'
import Link from 'next/link';
import ChatButton from './ChatButton';

interface ProductProps {
  product: Product;
  children: React.ReactNode;
  sellerName: string;
  uid: string | null;
}

export default function Product({ uid, product, sellerName, children }: ProductProps) {
  let imageList: React.ReactNode = 
    <Image
      src={ImgPlaceholder}
      alt="photo of a product"
      className="object-cover"
      fill
      priority
    />;

  if (product.imageUrls) {
    imageList = 
      product.imageUrls.map(imgUrl =>
        <Image
          key={imgUrl}
          src={imgUrl}
          alt="photo of a product"
          className="object-cover"
          fill
          priority
        />
      );
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-bold text-xl mb-7 max-w-6xl">{product.title}</h2>
      <Slider>{ imageList }</Slider>
      {children}
      <div className="flex flex-col gap-5">
        <p className="text-lg font-bold text-sky-600">{product.price} ₽</p>
        <p className="flex gap-5 items-center">
          Категория:
          <Link
            href={`/search?category=${product.category}`}
            className="border rounded-3xl p-2 transition-all hover:border-slate-400"
          >
            {product.category}
          </Link>
        </p>
        <p>Количество товара: {product.quantity}</p>
        <p>Продавец: <span className="font-bold">{sellerName}</span></p>
        <ChatButton
          uid={uid}
          productOwnerId={product.owner}
          productId={product.id}
        />
        <p className="flex flex-col gap-3">
          <span className="font-bold">Описание</span>
          <span>{product.description}</span>
        </p>
      </div>
    </div>
  );
}