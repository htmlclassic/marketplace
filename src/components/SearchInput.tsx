'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import clsx from "clsx";
import { throttle } from "lodash";

function isMobile() {
  return window.innerWidth < 640;
}

export default function SearchInput() {
  const searchParams = useSearchParams();
  const text = searchParams.get('text');

  const [searchValue, setSearchValue] = useState(text || '');
  const [maximized, setMaximized] = useState<boolean | null>(null);

  const router = useRouter();
  const href = `/search?text=${searchValue}`;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    if (isMobile()) setMaximized(false);
    else setMaximized(true);
  }, []);

  useEffect(() => {
    const handleMinimizeOnClick = () => {
      if (isMobile()) {
        setMaximized(false)
      }
    };

    const handleResize = throttle(() => {
      if (!isMobile()) setMaximized(true)
      else if (inputRef.current !== document.activeElement) {
        setMaximized(false);
      }
    }, 300);

    window.addEventListener('click', handleMinimizeOnClick);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('click', handleMinimizeOnClick);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className="grow max-w-[800px]"
      onClick={e => e.stopPropagation()}
    >
      <div className={clsx({
        "overflow-hidden group transition-all duration-300 ease-in-out rounded-full flex sm:border border-white border-opacity-20 focus-within:bg-white focus-within:text-gray-400": true,
        "w-12 sm:w-full": maximized === null,
        "w-full": maximized === true,
        "w-12": maximized === false
      })}>
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={handleChange}
          onKeyUp={e => {
            if (e.key === 'Escape' || e.key === 'Delete') {
              setSearchValue('');
            }
            else if (e.key === 'Enter') {
              inputRef.current?.blur();
              router.push(href);

              if (isMobile()) setMaximized(false);
            };
          }}
          placeholder="Искать на Marketplace"
          className={clsx({
            "transition-all duration-300 order-1 group-has-[:focus-within]:text-black bg-transparent w-full text-sm outline-none placeholder:text-white group-has-[:focus-within]:placeholder:text-gray-400": true,
            "py-1 px-5 pr-0": maximized === null || maximized === true,
            "opacity-0": maximized === false
          })}
        />
        <button
          disabled={!searchValue}
          onClick={() => {
            setSearchValue('');
            inputRef.current?.focus();
          }}
          className={clsx({
            "group-has-[:focus-within]:order-2 sm:order-2 order-3 shrink-0 w-12 h-12 flex justify-center items-center text-gray-300 transition-all duration-300 hover:text-black": true,
            "scale-0": !searchValue,
            "scale-100": searchValue,
            "opacity-0": maximized === false
          })}
          title="Очистить поле для поиска"
        >
          <CrossIcon />
        </button>
        <button
          onClick={() => {
            if (maximized) {
              inputRef.current?.blur();
              router.push(href);

              if (isMobile()) setMaximized(false);
            } else {
              setMaximized(true);
              inputRef.current?.focus();
            };
          }}
          className="group-has-[:focus-within]:order-3 order-2 sm:order-3 shrink-0 w-12 h-12 flex justify-center items-center text-gray-300 group-has-[:focus-within]:transition-all group-has-[:focus-within]:duration-300 group-has-[:focus-within]:hover:text-black"
          title="Поиск"
        >
          <SearchIcon />
        </button>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.66666 14.5C3.89999 14.5 0.833328 11.4333 0.833328 7.66667C0.833328 3.9 3.89999 0.833333 7.66666 0.833333C11.4333 0.833333 14.5 3.9 14.5 7.66667C14.5 11.4333 11.4333 14.5 7.66666 14.5ZM7.66666 1.83333C4.44666 1.83333 1.83333 4.45333 1.83333 7.66667C1.83333 10.88 4.44666 13.5 7.66666 13.5C10.8867 13.5 13.5 10.88 13.5 7.66667C13.5 4.45333 10.8867 1.83333 7.66666 1.83333Z" fill="currentColor"/>
      <path d="M14.6667 15.1667C14.54 15.1667 14.4133 15.12 14.3133 15.02L12.98 13.6867C12.7867 13.4933 12.7867 13.1733 12.98 12.98C13.1733 12.7867 13.4933 12.7867 13.6867 12.98L15.02 14.3133C15.2133 14.5067 15.2133 14.8267 15.02 15.02C14.92 15.12 14.7933 15.1667 14.6667 15.1667Z" fill="currentColor"/>
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="35" height="35" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.773 13.2877L13.2877 21.773C12.9978 22.0629 12.517 22.0629 12.227 21.773C11.9371 21.4831 11.9371 21.0022 12.227 20.7123L20.7123 12.227C21.0022 11.9371 21.4831 11.9371 21.773 12.227C22.0629 12.5169 22.0629 12.9978 21.773 13.2877Z" fill="currentColor"/>
      <path d="M21.773 21.773C21.4831 22.0629 21.0022 22.0629 20.7123 21.773L12.227 13.2877C11.9371 12.9978 11.9371 12.5169 12.227 12.227C12.517 11.9371 12.9978 11.9371 13.2877 12.227L21.773 20.7123C22.0629 21.0022 22.0629 21.4831 21.773 21.773Z" fill="currentColor"/>
    </svg>
  );
}