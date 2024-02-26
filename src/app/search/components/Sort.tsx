'use client';

import { useState, useEffect } from "react";
import clsx from "clsx";
import { Dispatch, SetStateAction } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  const router = useRouter();
  const sortStateInitial = searchParams.get('order') as OrderSearchParam | null;

  const [showSelector, setShowSelector] = useState(false);
  const [sortState, setSortState] = useState<OrderSearchParam>(sortStateInitial || 'price_asc');

  useEffect(() => {
    if (sortState !== sortStateInitial) {
      const params = insertSearchParams(searchParams, { order: sortState });

      router.replace(`/search?${params}`);
    }
  }, [sortState]);

  return (
    <div
      className="bg-white select-none mb-3 py-3 sticky top-[calc(var(--menu-height)+var(--header-height))] sm:top-[var(--header-height)]"
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