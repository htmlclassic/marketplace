import Link from "next/link";
import Image from "next/image";
import SearchInput from "../SearchInput/SearchInput";
import MessageIcon from './assets/message.svg';

export default function MobileHeader() {
  return (
    <div
      className="gradient sticky top-0 left-0 z-10 gap-0 flex justify-between items-center w-full h-[70px] px-[20px] pr-[5px] bg-white border-b sm:hidden"
    >
      <SearchInput />
      <Link href="/account/chats" className="py-[15px] px-[15px] shrink-0">
        <Image
          src={MessageIcon}
          alt="icon"
          width={30}
          height={30}
        />
      </Link>
    </div>
  );
}
