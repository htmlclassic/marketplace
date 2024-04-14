import { CounterClockwiseClockIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import SearchSuggestionItem from "./SearchSuggestionItem";

interface Props {
  suggestions: SearchSuggestion[];
  handleSuggestionClick: (searchText: string) => any;
  showHistoryIcon?: boolean;
}

export default function SearchSuggestionList({
  suggestions, 
  handleSuggestionClick,
  showHistoryIcon
}: Props) {
  return (
    <ul>
      {
        suggestions.map(item =>
          <SearchSuggestionItem 
            onClick={e => {
              e.stopPropagation();
              handleSuggestionClick(item.text);
            }}
            key={item.id}
          >
            {
              showHistoryIcon
                ? <CounterClockwiseClockIcon className="w-[20px] h-[20px] text-gray-400 shrink-0" />
                : <MagnifyingGlassIcon className="w-[20px] h-[20px] text-gray-400 shrink-0" />
            }
            {item.text}
          </SearchSuggestionItem>
        )
      }
    </ul>
  );
}