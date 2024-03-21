'use client';

import BankCard from "@/src/components/BankCard";
import { action } from "./actions";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { CartContext } from "@/src/CartContext";

interface Props {
  orderId: number;
  sumToPay: number;
}

export default function Client({ orderId, sumToPay }: Props) {
  const { clearCart } = useContext(CartContext);
  const router = useRouter();

  return (
    <div className="side-padding pt-5 grow flex justify-center items-center">
      <BankCard
        onSubmit={async () => {
          await action(orderId);

          clearCart();          
          router.refresh();
          router.push('/');
        }}
        sumToPay={sumToPay}
      />
    </div>
  );
}