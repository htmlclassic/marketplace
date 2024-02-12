'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { insertSearchParams } from "../utils_client";
import clsx from "clsx";

interface Props {
  show: boolean | null;
}

export default function Filters({ show }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [priceFrom, setPriceFrom] = useState(0);
  const [priceTo, setPriceTo] = useState(1000000);

  const router = useRouter();
  const searchParams = useSearchParams();

  // calculates div's height. height = calc(100vh - headerHeight)
  useEffect(() => {
    const headers = document.querySelectorAll('.service_header_class');

    // I have two separate headers for mobile and desktop. Maybe merge them into one?
    for (const header of Array.from(headers)) {
      const headerHeight = window.getComputedStyle(header).height;
      const isVisible = window.getComputedStyle(header).display !== 'none';

      if (isVisible) {
        ref.current!.style.height = `calc(100vh - ${headerHeight})`;
        break;
      }
    }
  }, []);

  useEffect(() => {
    const newParams = insertSearchParams(searchParams, {
      price_from: priceFrom,
      price_to: priceTo
    });

    router.push(`/search?${newParams}`);
  }, [priceFrom, priceTo]);

  return (
    <div className={clsx({
      "shrink-0 md:w-64 min-[900px]:w-80 max-w-[50vw] transition-all": true,
      "w-0": show === null
    })}>
      <div
        ref={ref}
        className={clsx({
          "md:w-64 min-[900px]:w-80 max-w-[50vw] h-screen fixed overflow-x-hidden overflow-y-auto md:border md:p-3 transition-all": true,
          "w-0": show === null
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