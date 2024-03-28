'use client';

import { useEffect, useRef } from "react";

interface Props {
  quantity: number;
  maxQuantity: number;
  setItemQuantity: (newQuantity: number) => void;
}

export default function Input({
  quantity,
  maxQuantity,
  setItemQuantity
}: Props) {
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const currentValue = Number(ref.current!.value);

    if (quantity !== currentValue) {
      ref.current!.value = String(quantity);
    }
  }, [quantity]);

  return (
    <input
      ref={ref}
      type="number"
      className="w-16 text-center bg-transparent outline-none"
      onFocus={e => e.target.select()}
      onBlur={e => {
        const value = Number(e.target.value);
        let nextValue: number;

        if (value < 1) {
          nextValue = 1;
        } else if (value > maxQuantity) {
          nextValue = maxQuantity;
        } else {
          nextValue = value;
        }

        e.target.value = nextValue.toString();
        setItemQuantity(nextValue);
      }}
      defaultValue={quantity}
    />
  );
}