'use client';

import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { Dispatch, SetStateAction } from "react";
import { useSearchParams, useRouter, ReadonlyURLSearchParams } from "next/navigation";
import { OrderSearchParam } from "../types";
import { insertSearchParams } from "../utils_client";

type DictionaryType = {
  [K in OrderSearchParam]: string;
};

const dict: DictionaryType = {
  'price_asc': 'сначала дешёвые',
  'price_desc': 'сначала дорогие',
  'rating_desc': 'сначала с лучшей оценкой'
};

interface Props {
  setShowFilters: Dispatch<SetStateAction<boolean | null>>;
}

export default function Sort({ setShowFilters }: Props) {
  const [showSelector, setShowSelector] = useState(false);
  const [sortState, setSortState] = useState<OrderSearchParam>('price_asc');
  const ref = useRef<HTMLDivElement | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  // calculates div's top. top = headerHeight
  useEffect(() => {
    const headers = document.querySelectorAll('.service_header_class');

    // I have two separate headers for mobile and desktop. Maybe merge them into one?
    for (const header of Array.from(headers)) {
      const headerHeight = window.getComputedStyle(header).height;
      const isVisible = window.getComputedStyle(header).display !== 'none';

      if (isVisible) {
        ref.current!.style.top = headerHeight;
        break;
      }
    }
  }, []);

  useEffect(() => {
    const params = insertSearchParams(searchParams, { order: sortState });

    router.push(`/search?${params}`);
  }, [sortState]);

  return (
    <div
      ref={ref}
      className="bg-white sticky select-none mb-3 py-3"
    >
      <div className="relative flex justify-between gap-3">
        <div className="static sm:relative">
            <span
              className="mr-1"
            >
              Сортировка:</span>
            <button
              onClick={() => setShowSelector(!showSelector)}
              className="text-sm text-blue-900 underline-offset-2 hover:underline"
            >
              {dict[sortState]}
              <span 
                className={clsx({
                  "ml-1 inline-block transition-all": true,
                  "rotate-180": !showSelector,
                })}
              >
                ^</span>
            </button>
            {
              showSelector &&
                <Selector
                  setSortState={setSortState}
                  setShowSelector={setShowSelector}
                  sortState={sortState}
                />
            }
          </div>
          <div className="lg:hidden">
            <button
              onClick={() => setShowFilters(prev => !prev)}
              className="border px-2"
            >
              F
            </button>
          </div>
      </div>
    </div>
  );
}

interface SelectorProps {
  setSortState: Dispatch<SetStateAction<OrderSearchParam>>;
  setShowSelector: Dispatch<SetStateAction<boolean>>;
  sortState: OrderSearchParam;
}

function Selector({ setSortState, setShowSelector, sortState }: SelectorProps) {
  return (
    <div className="flex flex-col overflow-hidden min-w-72 bg-white border rounded-lg absolute left-1/2 bottom-[-10px] -translate-x-1/2 translate-y-full">
        <label
          onClick={() => {
            setShowSelector(false);
            setSortState('price_asc');
          }}
          className="cursor-pointer p-2 flex items-center gap-3 transition-all hover:bg-sky-100"
        >
          <input type="radio" name="sort_option" defaultChecked={sortState === 'price_asc'} />
          <span>
            { capitalizeFirstLetter(dict.price_asc) }
          </span>
        </label>
        <label
          onClick={() => {
            setShowSelector(false);
            setSortState('price_desc');
          }}
          className="cursor-pointer p-2 flex items-center gap-3 transition-all hover:bg-sky-100"
        >
          <input type="radio" name="sort_option" defaultChecked={sortState === 'price_desc'} />
          <span>
            { capitalizeFirstLetter(dict.price_desc) }
          </span>
        </label>
        <label
          onClick={() => {
            setShowSelector(false);
            setSortState('rating_desc');
          }}
          className="cursor-pointer p-2 flex items-center gap-3 transition-all hover:bg-sky-100"
        >
          <input type="radio" name="sort_option" defaultChecked={sortState === 'rating_desc'} />
          <span>
            { capitalizeFirstLetter(dict.rating_desc) }
          </span>
        </label>
      </div>
  );
}

function capitalizeFirstLetter(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}