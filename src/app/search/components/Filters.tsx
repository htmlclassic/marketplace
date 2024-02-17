'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { insertSearchParams } from "../utils_client";
import clsx from "clsx";

interface Props {
  show: boolean | null;
}

export default function Filters({ show }: Props) {
  const [priceFrom, setPriceFrom] = useState(0);
  const [priceTo, setPriceTo] = useState(1000000);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const newParams = insertSearchParams(searchParams, {
      price_from: priceFrom,
      price_to: priceTo
    });

    router.push(`/search?${newParams}`);
  }, [priceFrom, priceTo]);

  return (
    <div className={clsx({
      "shrink-0 transition-all sticky top-[var(--header-height)] overflow-hidden": true,
      "w-0": !show,
      "w-80": show === true || show === null
    })}>
      <div
        className={clsx({
          "bg-white h-[calc(100vh-var(--header-height))] overflow-x-hidden overflow-y-auto md:border md:p-3 transition-all": true,
        })}
      >
        <div className="flex flex-col gap-5">
          <div>
            <div className="mb-2 text-sm font-semibold">Цена</div>
            <div className="flex gap-3">
              <input
                onBlur={e => setPriceFrom(+e.target.value)}
                defaultValue={priceFrom}
                className="w-full border rounded p-1" 
                type="number" 
                placeholder="от"
              />
              <input
                onBlur={e => setPriceTo(+e.target.value)}
                defaultValue={priceTo}
                className="w-full border rounded p-1" 
                type="number" 
                placeholder="до"
              />
            </div>
          </div>
          <button
            className="border py-2"
          >Применить (зачем кнопка? го на расфокус)</button>
        </div>
      </div>
    </div>
  );
}