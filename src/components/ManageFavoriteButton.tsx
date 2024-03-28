'use client';

import { getAPI } from "@/supabase/api";
import { createClientSupabaseClient } from "@/supabase/utils_client";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  isFavorite: boolean;
  productId: string;
  hideText?: boolean;
}

export default function ManageFavoriteButton({
  isFavorite: isFavoriteInitial,
  productId,
  hideText
}: Props) {
  const api = getAPI(createClientSupabaseClient());
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(isFavoriteInitial);

  const handleClick = async () => {
    setIsFavorite(!isFavorite);

    if (isFavorite) {
      await api.deleteFavoriteProduct(productId);
    } else {
      await api.addFavoriteProduct(productId);
    }

    router.refresh();
  };

  return (
    <div
      className="flex items-center cursor-pointer select-none"
      title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
      onClick={handleClick}
    >
      <button
        className={clsx({
          "p-3 pl-0 flex items-center justify-center": true,
          "text-red-400": isFavorite,
          "text-transparent": !isFavorite
        })}
      >
        <Icon />
      </button>
      {
        !hideText &&
          <span>Добавить в избранное</span>
      }
    </div>
  );
}

function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className="w-6 h-6 transition-all stroke-red-400"
    >
      <path
        fill="currentColor"
        d="M2 9.137C2 14 6.02 16.591 8.962 18.911 10 19.729 11 20.5 12 20.5s2-.77 3.038-1.59C17.981 16.592 22 14 22 9.138c0-4.863-5.5-8.312-10-3.636C7.5.825 2 4.274 2 9.137z"
      ></path>
    </svg>
  );
}