import { getAPI } from "@/supabase/api";
import { createServerComponentSupabaseClient } from "@/supabase/utils_server";
import ChatPreviewList from "./ChatPreviewList";

interface LastMessageI {
  text: string;
  authorId: string;
}

type LastMessage = LastMessageI | null;

export type Chats = (Chat & { message: LastMessage } & { anotherSideName: string; })[];

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentSupabaseClient();
  const api = getAPI(supabase);

  const uid = (await api.getCurrentUserId())!;

  const chats = (await getChats(uid)) || [];

  const messages = await Promise.all(
    chats.map(chat => getLastMessage(chat.id))
  );

  let superChats: Chats = chats.map((chat, index) => ({
    ...chat,
    message: messages[index]
  }));

  return (
    <div className="grow flex border rounded-lg">
      <div className="w-[350px]">
        <ChatPreviewList chats={superChats} uid={uid} />
      </div>
      <div className="border-l flex grow">
        { children }
      </div>
    </div>
  );
}

async function getChats(uid: string) {
  const supabase = createServerComponentSupabaseClient();

  async function getUserName(id: string) {
    const { data: anotherSideName } = await supabase.rpc('get_user_name', { userid: id })

    return anotherSideName!;
  }

  const { data: chats } = await supabase
    .from('chat')
    .select()
    .or(`customer_id.eq.${uid},seller_id.eq.${uid}`)
    .order('created_at', { ascending: false });

  if (chats?.length) {
    const anotherSideNames = await Promise.all(
      chats.map(chat => {
        const id = chat.customer_id === uid ? chat.seller_id : chat.customer_id;
        return getUserName(id);
      })
    );

      return chats.map((chat, index) => ({
        ...chat,
        anotherSideName: anotherSideNames[index]
      }));
  }

  return null;
}

async function getLastMessage(chatId: number): Promise<LastMessage> {
  const supabase = createServerComponentSupabaseClient();

  const { data: lastMessage } = await supabase
    .from('chat_message')
    .select()
    .eq('chat_id', chatId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return lastMessage
    ?
      {
        text: lastMessage.text,
        authorId: lastMessage.author_id 
      }
    : null;
}