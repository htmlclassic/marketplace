import Link from "next/link";

export default function EmptyCart() {
  return (
    <div className="grow flex flex-col gap-4 justify-center items-center">
      <p className="flex flex-col items-center">Ваша корзина пока что пуста <span className="text-xl">😢</span></p>
      <Link
        href="/"
        className="link-button"
      >К покупкам</Link>
    </div>
  );
}