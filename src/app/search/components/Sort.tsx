'use client';

import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { Dispatch, SetStateAction } from "react";
import { useSearchParams, useRouter, ReadonlyURLSearchParams } from "next/navigation";
import { OrderSearchParam } from "../types";
import { insertSearchParams } from "../utils";

type DictionaryType = {
  [K in OrderSearchParam]: string;
};

const dict: DictionaryType = {
  'price_asc': 'сначала дешёвые',
  'price_desc': 'сначала дорогие',
  'rating_desc': 'сначала с лучшей оценкой'
};

export default function Sort() {
  const searchParams = useSearchParams();
  const sortValue = searchParams.get('order') as OrderSearchParam | null || 'price_asc';
  const [showSelector, setShowSelector] = useState(false);

  return (
    <div
      className="bg-white z-50 select-none mb-3 py-3 sticky top-[calc(var(--menu-height)+var(--header-height))] sm:top-[var(--header-height)]"
    >
      <div className="relative flex justify-between gap-3">
        <div className="static sm:relative">
            <span
              className="mr-1"
            >
              Сортировка:</span>
            <button
              onClick={e => {
                e.stopPropagation();
                setShowSelector(!showSelector);
              }}
              className="text-sm text-blue-900 underline-offset-2 hover:underline"
            >
              {dict[sortValue]}
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
                  setShowSelector={setShowSelector}
                  sortValue={sortValue}
                  searchParams={searchParams}
                />
            }
          </div>
      </div>
    </div>
  );
}

interface SelectorProps {
  setShowSelector: Dispatch<SetStateAction<boolean>>;
  sortValue: OrderSearchParam;
  searchParams: ReadonlyURLSearchParams;
}

function Selector({ setShowSelector, sortValue, searchParams }: SelectorProps) {
  const router = useRouter();

  useEffect(() => {
    const handleCloseSelector = () => {
      setShowSelector(false);
    };

    window.addEventListener('click', handleCloseSelector);

    return () => window.removeEventListener('click', handleCloseSelector);
  }, []);

  return (
    <div className="flex flex-col overflow-hidden min-w-72 bg-white border rounded-lg absolute left-1/2 bottom-[-10px] -translate-x-1/2 translate-y-full">
        <label
          onClick={() => {
            const params = insertSearchParams(searchParams, { order: 'price_asc' });
            router.replace(`/search?${params}`);
          }}
          className="cursor-pointer p-2 flex items-center gap-3 transition-all hover:bg-sky-100"
        >
          <input type="radio" name="sort_option" defaultChecked={sortValue === 'price_asc'} />
          <span>
            { capitalizeFirstLetter(dict.price_asc) }
          </span>
        </label>
        <label
          onClick={() => {
            const params = insertSearchParams(searchParams, { order: 'price_desc' });
            router.replace(`/search?${params}`);
          }}
          className="cursor-pointer p-2 flex items-center gap-3 transition-all hover:bg-sky-100"
        >
          <input type="radio" name="sort_option" defaultChecked={sortValue === 'price_desc'} />
          <span>
            { capitalizeFirstLetter(dict.price_desc) }
          </span>
        </label>
        <label
          onClick={() => {
            const params = insertSearchParams(searchParams, { order: 'rating_desc' });
            router.replace(`/search?${params}`);
          }}
          className="cursor-pointer p-2 flex items-center gap-3 transition-all hover:bg-sky-100"
        >
          <input type="radio" name="sort_option" defaultChecked={sortValue === 'rating_desc'} />
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