'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { insertSearchParams } from "../utils";
import clsx from "clsx";

interface Props {
  show: boolean | null;
}

export default function Filters({ show }: Props) {
  const DEFAULT_FROM = 0;
  const DEFAULT_TO = 1_000_000_000;

  const [priceFrom, setPriceFrom] = useState(DEFAULT_FROM);
  const [priceTo, setPriceTo] = useState(DEFAULT_TO);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (priceFrom !== DEFAULT_FROM && priceTo !== DEFAULT_TO) {
      const newParams = insertSearchParams(searchParams, {
        price_from: priceFrom,
        price_to: priceTo
      });
  
      router.replace(`/search?${newParams}`);
      router.refresh();
    }
  }, [priceFrom, priceTo]);

  return (
    <div className={clsx({
      "shrink-0 transition-all sticky self-start top-[calc(var(--menu-height)+var(--header-height))] sm:top-[calc(var(--header-height))] overflow-hidden side-padding": true,
      "w-0 sm:w-80": show === null,
      "w-0": show === false,
      "w-80": show === true
    })}>
      <div
        className={clsx({
          "bg-white sm:h-[calc(100vh-var(--header-height)-var(--mobile-menu-height))] h-[calc(100vh-var(--header-height)-var(--menu-height)-var(--mobile-menu-height))] overflow-x-hidden overflow-y-auto pt-3 transition-all": true,
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
        </div>
      </div>
    </div>
  );
}