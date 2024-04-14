import { createClientSupabaseClient } from "@/supabase/utils_client";

export const SUGGESTIONS_COUNT_LIMIT = 10;

export async function getSuggestions(text: string) {
  if (text === '') return [];

  const supabase = createClientSupabaseClient();

  const { data: suggestions, error } = await supabase
    .rpc('get_unique_product_types')
    .ilike('type', `${text}%`)
    .limit(SUGGESTIONS_COUNT_LIMIT);

  if (error) throw new Error(error.message);

  // this function should return real ids not the fake ones
  return suggestions.map((item, i) => ({
    id: i,
    text: item.type
  }));
}

export function getSearchHistoryNextId(searchHistory: SearchSuggestion[]) {
  if (searchHistory.length === 0) return 0;

  const maxId = Math.max(...searchHistory.map(i => i.id));

  return maxId + 1;
}

export function saveSearchHistoryToLocalStorage(searchHistory: SearchSuggestion[]) {
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

export function getSearchHistoryFromLocalStorage() {
  const sHistory = localStorage.getItem('searchHistory');

  if (sHistory) {
    const parsedHistory = JSON.parse(sHistory) as SearchSuggestion[];

    if (parsedHistory.length)
      return parsedHistory.slice(-SUGGESTIONS_COUNT_LIMIT).reverse();
  }

  return null;
}