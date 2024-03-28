import { Button } from "@/src/components/ui/button";
import Link from "next/link";

export default function EmptyCart() {
  return (
    <div className="grow flex flex-col gap-4 justify-center items-center">
      <p className="flex flex-col items-center">Ваша корзина пуста</p>
      <Link
        href="/"
      >
        <Button
          className="w-[250px] py-7"
        >
          К покупкам
        </Button>
      </Link>
    </div>
  );
}