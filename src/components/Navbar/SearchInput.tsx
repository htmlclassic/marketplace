'use client';

import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SearchIcon from './assets/search-icon.svg';
import Image from "next/image";

export default function SearchInput() {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const href = searchValue !== '' ? `/search?text=${searchValue}` : '/' ;

  useEffect(() => {
    const handleCloseMobileSearch = (e: MouseEvent) => {
      if (e.composedPath().includes(ref.current as EventTarget)) return;

      setShowMobileSearch(false);
    };

    window.addEventListener('click', handleCloseMobileSearch);

    return () => document.removeEventListener('click', handleCloseMobileSearch)
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
  <div className="relative flex gap-3 grow max-w-[600px]" ref={ref}>
      <button
        onClick={() => setShowMobileSearch(!showMobileSearch)}
        className="min-[530px]:hidden p-2 shrink-0">
          <Image
            src={SearchIcon}
            alt="search icon"
            width={25}
            height={25}
          />
      </button>
      <div
        className={clsx({
          'fixed z-10 left-[-2px] w-[calc(100vw+2px)] transition-transform duration-200 bg-[rgba(0,0,0,0.8)] backdrop-blur-md p-10 flex flex-col items-center gap-6 min-[530px]:translate-y-0 min-[530px]:bg-transparent min-[530px]:static min-[530px]:w-full min-[530px]:p-0 min-[530px]:flex-row': true,
          'translate-y-0 top-[100%]': showMobileSearch,
          '-translate-y-full top-[0]': !showMobileSearch
        })}>
        <input
          type="text"
          value={searchValue}
          onChange={handleChange}
          onKeyUp={e => {
            if (e.key === 'Escape') setSearchValue('');
            else if (e.key === 'Enter') {
              router.push(href);
              setShowMobileSearch(false);
            };
          }}
          placeholder="Искать на Marketplace"
          className="rounded-sm outline-none text-black px-3 py-[0.20rem] w-full placeholder:text-sm h-12 min-[530px]:h-auto"
        />
        <Link
          onClick={() => setShowMobileSearch(false)}
          href={href}
          className="border-2 border-white rounded-sm px-8 py-2 min-[530px]:px-3 min-[530px]:py-0 transition-all duration-300 outline-none hover:text-black hover:bg-white focus:text-black focus:bg-white focus:shadow-around"
        >Поиск</Link>
      </div>
    </div>
  );
}
