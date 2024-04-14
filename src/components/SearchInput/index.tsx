'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import SearchSuggestionList from "./components/SearchSuggestionList";
import { createClientSupabaseClient } from "@/supabase/utils_client";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { getSearchHistoryFromLocalStorage, getSearchHistoryNextId, getSuggestions, saveSearchHistoryToLocalStorage } from "./utils";

const MOBILE_BREAKPOINT = 640;

interface Props {
  searchHistory: SearchSuggestion[];
}

export default function SearchInput({ searchHistory: searchHistoryInitial }: Props) {
  const supabase = createClientSupabaseClient();
  const router = useRouter();

  const searchParams = useSearchParams();
  const text = searchParams.get('text');

  const [searchHistory, setSearchHistory] = useState(searchHistoryInitial);
  const [active, setActive] = useState(false);
  const [searchValue, setSearchValue] = useState(text || '');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { data: suggestions } = useQuery({ 
    queryKey: ['suggestions', searchValue], 
    queryFn: () => getSuggestions(searchValue),
    placeholderData: prev => prev
  });

  const search = async (text: string) => {
    setActive(false);
    
    if (text === '') return;

    router.push(`/search?text=${text}`);

    const { data: { user } } = await supabase.auth.getUser();
    const uid = user?.id;

    if (uid) {
      // delete the same history record if it exists
      await supabase
        .from('search_history')
        .delete()
        .ilike('text', text);

      const { data: newSearchItem } = await supabase
        .from('search_history')
        .insert({ text, user_id: uid })
        .select('id')
        .limit(1)
        .single();

      if (!newSearchItem) return;

      const nextSearchHistory: SearchSuggestion[] = [
        ...searchHistory,
        {
          text,
          id: newSearchItem.id
        }
      ];

      saveSearchHistoryToLocalStorage(nextSearchHistory);

      router.refresh()
    } else {
      const filteredSearchHistory = searchHistory.filter(
        i => i.text.toLowerCase() !== text.toLowerCase()
      );

      const nextSearchHistory: SearchSuggestion[] = [
        ...filteredSearchHistory,
        {
          text,
          id: getSearchHistoryNextId(searchHistory)
        }
      ];

      setSearchHistory(nextSearchHistory);
      saveSearchHistoryToLocalStorage(nextSearchHistory);
    }
  };

  const handleSuggestionClick = (text: string) => {
    setSearchValue(text);
    search(text);
  };

  // update searchHistory state on server component refresh
  useEffect(() => {
    if (searchHistoryInitial.length && searchHistoryInitial !== searchHistory) {
      setSearchHistory(searchHistoryInitial);
    }
  }, [searchHistoryInitial])

  // 1) lock body scroll, when user opens search on mobile device
  // 2) focus input on it's wrapper click
  useEffect(() => {
    if (active) {
      inputRef.current?.focus();

      if (window.innerWidth <= MOBILE_BREAKPOINT)
        document.body.style.overflow = 'hidden';
    }
    else {
      inputRef.current?.blur();
      document.body.style.overflow = '';
    }
    
    return () => { document.body.style.overflow = ''; };
  }, [active]);

  // close search on outside click
  useEffect(() => {
    const handleCloseSearch = () => setActive(false);

    window.addEventListener('click', handleCloseSearch);

    return () => { window.removeEventListener('click', handleCloseSearch) };
  }, []);


  // try to get search history from local storage,
  // if initial search history is empty
  useEffect(() => {
    if (window && searchHistory.length === 0) {
      const history = getSearchHistoryFromLocalStorage();

      if (history) setSearchHistory(history);
    }
  }, []);

  return (
    <div
      className={clsx({
        "flex flex-col sm:relative sm:bg-transparent left-0 top-0 w-full sm:h-auto grow max-w-[800px]": true,
        "fixed bg-white h-[calc(100vh-var(--mobile-menu-height))]": active
      })}
      onClick={e => {
        e.stopPropagation();
        setActive(true);
      }}
    >
      <div className={clsx({
        "sm:px-5 overflow-hidden w-full border border-white border-opacity-30 flex transition-all": true,
        "sm:rounded-full pr-5 sm:bg-white": active,
        "rounded-full px-5": !active
      })}>
        <button 
          onClick={e => {
            e.stopPropagation();
            setActive(false);
          }}
          className={clsx({
            "text-black px-5 sm:hidden": true,
            "hidden": !active
          })}
        >
          <ArrowLeftIcon />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          onKeyUp={e => {
            if (e.key === 'Escape' || e.key === 'Delete') {
              setSearchValue('');
            }
            else if (e.key === 'Enter') {
              inputRef.current?.blur();
              search(searchValue);
            };
          }}
          placeholder="Искать на Marketplace"
          className={clsx({
            "bg-transparent w-full text-sm outline-none text-black placeholder:text-gray-200 transition-all": true,
            "placeholder:text-gray-500 sm:placeholder:text-gray-300": active,
            "text-white": !active
          })}
        />
        <button
          onClick={() => setSearchValue('')}
          className={clsx({
            "shrink-0 w-12 h-12 flex justify-end items-center text-gray-300": true,
            "cursor-text": !searchValue,
            "hidden": !active
          })}
          title="Очистить поле для поиска"
        >
          <div className={clsx({
            "transition-all duration-300": true,
            "scale-0": !searchValue,
            "scale-100": searchValue,
          })}>
            <CrossIcon />
          </div>
        </button>
        <button
          onClick={() => search(searchValue)}
          className="shrink-0 w-12 h-12 flex justify-end items-center text-gray-300"
          title="Поиск"
        >
          <SearchIcon />
        </button>
      </div>
      <div
        className={clsx({
          "z-[51] sm:w-[80vw] lg:w-full sm:fixed lg:absolute transition-all p-3 sm:rounded-lg border-t border-gray-200 sm:border-none sm:shadow-[0_5px_10px_5px_rgba(0,0,0,0.3)] grow top-[calc(100%+5px)] left-1/2 sm:-translate-x-1/2 bg-white text-black": true,
          "opacity-0 translate-y-[150px] pointer-events-none absolute": !active || (searchValue ? !suggestions?.length : !searchHistory.length),
        })}
      >
        <SearchSuggestionList
          showHistoryIcon={!searchValue}
          suggestions={searchValue ? suggestions ?? [] : searchHistory}
          handleSuggestionClick={handleSuggestionClick}
        />
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