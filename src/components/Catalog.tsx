'use client';

import { createClientSupabaseClient } from "@/supabase/utils_client";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Props {
  hide: () => void;
  show: boolean;
}

type Categories = Awaited<ReturnType<typeof getCategories>>;

export default function CatalogClient({ show, hide }: Props) {
  const [categories, setCategories] = useState<Categories | null>(null);

  useEffect(() => {
    (async () => {
      const categories = await getCategories();
      setCategories(categories);
    })();
  }, []);

  if (!categories) return null;

  return (
    <div
      onClick={e => e.stopPropagation()}
      className={clsx({
        "[--initial-translate:calc(var(--header-height))] z-50 bg-black text-white bg-opacity-80 backdrop-blur-md absolute left-1/2 top-0 -translate-x-1/2 w-[60%] p-6 rounded-2xl transition-all duration-300 ease-in-out": true,
        "translate-y-[calc(var(--initial-translate)+1rem)]": show,
        "opacity-0 pointer-events-none translate-y-[calc(var(--initial-translate)-1rem)]": !show
      })}
    >
      <div
      >
        <div className="grid grid-cols-[repeat(4,max-content)] gap-x-2 gap-y-7 justify-between">
          {
            categories.map(cat =>
              <Link
                href={`/search?category=${cat.name}`}
                className="transition-all hover:text-sky-400 hover:underline"
                onClick={hide}
                key={cat.id}
              >
                {cat.name}
              </Link>
            )
          }
        </div>
      </div>
    </div>
  );
}

async function getCategories() {
  const supabase = createClientSupabaseClient();

  const { data: categories } = await supabase
    .from('category')
    .select('id, name');

  return categories?.length ? categories : null;
}