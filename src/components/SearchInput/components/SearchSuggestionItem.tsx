interface Props {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLLIElement>) => any;
}

export default function SearchSuggestionItem({ children, onClick }: Props) {
  return (
    <li 
      onClick={onClick}
      className="flex gap-3 items-center hover:bg-gray-200 p-2 rounded-lg cursor-pointer"
    >
      {children}
    </li>
  );
}