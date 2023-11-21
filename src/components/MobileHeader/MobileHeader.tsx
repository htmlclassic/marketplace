import Link from "next/link";
import SearchInput from "../SearchInput/SearchInput";

export default function MobileHeader() {
  return (
    <div
      className="sticky top-0 left-0 z-10 flex gap-10 justify-between items-center w-full h-[70px] px-[20px] bg-[#82ebae] sm:hidden"
    >
      <Link href="/" className="font-bold text-3xl">M</Link>
      <SearchInput hideButton />
    </div>
  );
}
