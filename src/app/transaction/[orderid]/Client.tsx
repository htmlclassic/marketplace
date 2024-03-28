'use client';

import BankCard from "@/src/components/BankCard";
import { action } from "./actions";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { CartContext } from "@/src/CartContext";

interface Props {
  session: boolean;
  orderId: number;
  sumToPay: number;
}

export default function Client({ orderId, sumToPay, session }: Props) {
  const { clearCart } = useContext(CartContext);
  const router = useRouter();

  return (
    <div className="side-padding pt-5 grow flex justify-center items-center">
      <BankCard
        onSubmit={async () => {
          await action(orderId);

          clearCart();          
          
          if (session) router.push('/account/orders');
          else router.push(`/track-order/${orderId}`);
        }}
        sumToPay={sumToPay}
      />
    </div>
  );
}