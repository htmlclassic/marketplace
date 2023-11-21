'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import ClearInputIcon from './assets/cross.svg';
import Image from "next/image";
import clsx from "clsx";

interface Props {
  hideButton?: boolean;
}

export default function SearchInput({ hideButton }: Props) {
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();
  const href = searchValue !== '' ? `/search?text=${searchValue}` : '/' ;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
  <div className="flex gap-3 grow max-w-[800px]">
    <div className="w-full relative">
      <input
        ref={inputRef}
        type="text"
        value={searchValue}
        onChange={handleChange}
        onKeyUp={e => {
          if (e.key === 'Escape') {
            setSearchValue('');
          }
          else if (e.key === 'Enter') {
            inputRef.current!.blur();
            router.push(href);
          };
        }}
        placeholder="Искать на Marketplace"
        className="text-black w-full rounded text-sm px-[calc(1.5rem+16px)] py-3 bg-[url('/search.svg')] bg-no-repeat bg-[length:16px] bg-[0.5rem_center] outline-none"
      />
      <button
        onClick={() => {
          setSearchValue('');
          inputRef.current!.focus();
        }}
        className={clsx({
          "absolute right-0 top-0 rounded w-[calc(1.5rem+16px)] h-full flex justify-center items-center": true,
          "hidden": !searchValue
        })}
      >
        <Image
          src={ClearInputIcon}
          width={35}
          height={35}
          alt="очистить поисковое поле"
          className="shrink-0"
        />
      </button>
    </div>
    {
      !hideButton &&
      <Link
        href={href}
        className="flex items-center border-2 border-black rounded-sm px-3 transition-all duration-300 outline-none hover:text-black hover:bg-white focus:text-black focus:bg-white focus:shadow-around"
      >Поиск</Link>
    }
    </div>
  );
}
