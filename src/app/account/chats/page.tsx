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

export default async function Page() {
  const supabase = createServerComponentSupabaseClient();
  const api = getAPI(supabase);
  const uid = ( await api.getCurrentUserId() )!; // layout.tsx in /account ensures that uid exists
  const userName = (await getUserName(uid)) || 'you';
  let resultedChats: ChatsT = [];

  const { data: chats } = await supabase
    .from('chat')
    .select()
    .or(`customer_id.eq.${uid},seller_id.eq.${uid}`);

  if (chats?.length) {
    for (const chat of chats) {
      const chat_id = chat.id;
  
      let { data: messages } = await supabase
        .from('chat_message')
        .select()
        .eq('chat_id', chat_id)
        .order('created_at', { ascending: false });
  
      let filteredMessages: Message[] | null = null;
      let anotherPersonName: string;
  
      if (chat.customer_id === uid) {
        anotherPersonName = (await getUserName(chat.seller_id)) || 'other guy';
      } else {
        anotherPersonName = (await getUserName(chat.customer_id)) || 'other guy';
      }
  
      const relatedProduct = (await api.getProducts([ chat.product_id ]))!;
  
      if (messages?.length) {
        filteredMessages = messages.map(message => ({
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
          product: relatedProduct[0],
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