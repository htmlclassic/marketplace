import { getAPI } from "@/supabase/api";
import { createServerComponentSupabaseClient } from "@/supabase/utils_server";
import ChatList from "./ChatList";

export interface Message {
  text: string;
  createdAt: string;
  author_id: string;
}

interface ChatI {
  uid: string;
  id: number;
  creatorId: string;
  messages: Message[] | null;
  anotherPersonName: string;
  userName: string;
  product: Product;
}

export type ChatsT = ChatI[] | null;

// refactored to make less requests than it was before, but two things need to be made better:
// 1) types are difficult. wtf is ChatI?
// 2) i dont like making a request to get other user name on every loop iteration
export default async function Page() {
  const supabase = createServerComponentSupabaseClient();
  const api = getAPI(supabase);
  const uid = ( await api.getCurrentUserId() )!; // layout.tsx in /account ensures that uid exists
  const userName = (await getUserName(uid)) || 'you';
  let resultedChats: ChatsT = [];

  const { data: chats } = await supabase
    .from('chat')
    .select('*, chat_message(*), product(*)');

  if (chats?.length) {
    for (const chat of chats) {
      let filteredMessages: Message[] | null = null;
      let anotherPersonName: string;
  
      if (chat.customer_id === uid) {
        anotherPersonName = (await getUserName(chat.seller_id)) || 'other guy';
      } else {
        anotherPersonName = (await getUserName(chat.customer_id)) || 'other guy';
      }
  
      if (chat.chat_message?.length) {
        filteredMessages = chat.chat_message.map(message => ({
          createdAt: message.created_at!,
          text: message.text,
          author_id: message.author_id
        }));
      }
  
      resultedChats.push({
          uid,
          id: chat.id,
          messages: filteredMessages,
          anotherPersonName,
          userName,
          product: chat.product!,
          creatorId: chat.customer_id
      });
    }
  } else {
    resultedChats = null;
  }

  return (
    <ChatList chats={resultedChats} />
  );
}

async function getUserName(id: string) {
  const supabase = createServerComponentSupabaseClient();

  const { data } = await supabase.rpc('get_user_name', { userid: id});

  return data;
}