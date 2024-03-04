import { getAPI } from "@/supabase/api";
import { createServerComponentSupabaseClient } from "@/supabase/utils_server";
import ChatList from "./ChatList";
import { getChats } from "./utils";

export interface Message {
  text: string;
  created_at: string;
  author_id: string;
}

interface Chat {
  uid: string;
  id: number;
  creatorId: string;
  messages: Message[] | null;
  anotherPersonName: string;
  product: StrippedProduct;
}

export type StrippedProduct = Pick<Product, 'id' | 'title' | 'img_urls'>;

export type Chats = Chat[] | null;

export default async function Page() {
  const supabase = createServerComponentSupabaseClient();
  const api = getAPI(supabase);
  const uid = ( await api.getCurrentUserId() )!; // layout.tsx in /account ensures that uid exists
  let resultedChats: Chats = [];

  const chats = await getChats(supabase);

  if (chats) {
    for (const chat of chats) {
      let anotherPersonName = chat.customer_name;
  
      if (chat.customer_id === uid) {
        anotherPersonName = chat.seller_name;
      }
  
      resultedChats.push({
          uid,
          id: chat.id,
          messages: chat.chat_message as Message[],
          anotherPersonName,
          product: chat.product!,
          creatorId: chat.customer_id
      });
    }
  }

  return (
    <ChatList chats={resultedChats} />
  );
}