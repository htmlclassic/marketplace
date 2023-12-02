import Slider from '@/src/components/Slider';
import Image from 'next/image';
import ImgPlaceholder from '@/src/components/noimage.jpg'
import Link from 'next/link';
import ChatButton from './ChatButton';
import { Tabs } from './Tabs';

interface ProductProps {
  product: Product;
  ManageCartItemButton: React.ReactNode;
  Reviews: React.ReactNode;
  sellerName: string;
  uid: string | null;
}

export default function Product({
  uid,
  product,
  sellerName,
  ManageCartItemButton,
  Reviews
}: ProductProps) {
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
      <h2 className="font-bold text-xl max-w-6xl order-1 sm:mb-3 sm:order-none">{product.title}</h2>
      <div className="flex-col gap-5 w-max contents sm:flex">
        <Slider>{ imageList }</Slider>
        <div className="order-2 flex-col gap-3 sm:flex-row flex">
          {ManageCartItemButton}
          <ChatButton
            uid={uid}
            productOwnerId={product.owner}
            productId={product.id}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5 order-2">
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
        <p>Продавец: <span className="font-bold">{sellerName}</span></p>
      </div>
      <div className="order-last">
        <Tabs
          elements={[
            {
              node: (
                <p className="flex flex-col gap-3 max-w-6xl">
                  <span>{product.description}</span>
                </p>
              ),
              title: 'Описание'
            },
            {
              node: Reviews,
              title: 'Отзывы'
            }
          ]}
        />
      </div>
    </div>
  );
}