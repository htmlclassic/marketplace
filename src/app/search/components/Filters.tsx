'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { insertSearchParams } from "../utils";
import clsx from "clsx";
import type { Categories } from '../types';

interface Props {
  show: boolean | null;
}

export default function Filters({ show }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const DEFAULT_FROM = 0;
  const DEFAULT_TO = 1_000_000_000;

  const priceFrom = Number(searchParams.get('price_from')) || DEFAULT_FROM;
  const priceTo = Number(searchParams.get('price_to')) || DEFAULT_TO;

  return (
    <div
      className={clsx({
        "shrink-0 transition-all sticky self-start top-[calc(var(--menu-height)+var(--header-height))] sm:top-[calc(var(--header-height))] overflow-hidden sm:side-padding": true,
        "w-0 sm:w-80": show === null,
        "w-0 p-0": show === false,
        "w-80": show === true
      })}
    >
      <div
        className={clsx({
          "bg-white sm:h-[calc(100vh-var(--header-height)-var(--mobile-menu-height))] h-[calc(100vh-var(--header-height)-var(--menu-height)-var(--mobile-menu-height))] overflow-x-hidden overflow-y-auto pt-3 transition-all p-2": true,
        })}
      >
        <div className="flex flex-col gap-5">
          <div>
            <div className="mb-2 text-sm font-semibold">Цена</div>
            <div className="flex gap-3">
              <input
                onBlur={e => {
                  let value = +e.target.value;

                  if (value < 0) {
                    value = DEFAULT_FROM;
                    e.target.value = value.toString();
                  }

                  const params = insertSearchParams(searchParams, { price_from: value.toString() });
                  router.replace(`/search?${params}`);
                }}
                defaultValue={priceFrom}
                className="w-full border rounded p-1" 
                type="number" 
                placeholder="от"
              />
              <input
                onBlur={e => {
                  let value = +e.target.value;

                  if (value <= 0) {
                    value = DEFAULT_TO;
                    e.target.value = value.toString();
                  }

                  const params = insertSearchParams(searchParams, { price_to: value.toString() });
                  router.replace(`/search?${params}`);
                }}
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