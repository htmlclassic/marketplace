import Link from "next/link";

interface Props {
  anotherSideName: string;
  lastMessage: string | undefined;
  authorId: string | undefined;
  chatId: number;
  uid: string;
}

export default function ChatsPreview({ anotherSideName, lastMessage, chatId, authorId, uid }: Props) {
  return (
    <Link href={`/account/chats/${chatId}`} className="flex gap-3 items-center p-3 border-b transition-all hover:bg-yellow-100">
      <div className="text-5xl w-20 h-20 border-r flex items-center justify-center flex-shrink-0">{anotherSideName.charAt(0).toUpperCase()}</div>
      <div className="flex flex-col gap-1">
        <div className="font-bold">{anotherSideName}</div>
        <div className="text-gray-500 line-clamp-2 [overflow-wrap:anywhere]">
          {
            authorId === uid &&
            'Вы: '
          }
          {
            lastMessage ? lastMessage : 'Задайте вопрос продавцу'
          }
        </div>
      </div>
    </Link>
  );
}
