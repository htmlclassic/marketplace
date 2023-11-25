import { getAPI } from "@/supabase/api";
import { createServerComponentSupabaseClient } from "@/supabase/utils_server";
import Chat from "./Chat";

export interface Message {
  text: string;
  createdAt: string;
  author_id: string;
}

interface Props {
  params: {
    chatId: string;
  }
}

export default async function Page({ params: { chatId } }: Props) {
  const supabase = createServerComponentSupabaseClient();
  const api = getAPI(supabase);
  const uid = ( await api.getCurrentUserId() )!;

  const { data: chat } = await supabase
    .from('chat')
    .select()
    .eq('id', chatId)
    .limit(1)
    .single();

  if (!chat) return <div>Нет такого чата</div>

  const chat_id = chat.id;
  const { data: messages } = await supabase
    .from('chat_message')
    .select()
    .eq('chat_id', chat_id)
    .order('created_at', { ascending: false });

  let filteredMessages: Message[] = [];
  let anotherPersonName = 'noname';

  if (messages?.length) {
    const anotherPersonMessage = messages.find(msg => msg.author_id !== uid);
    
    if (anotherPersonMessage) {
      const name = await getUserName(anotherPersonMessage.author_id);

      if (name) anotherPersonName = name;
    }

    filteredMessages = messages.map(message => ({
      createdAt: message.created_at!,
      text: message.text,
      author_id: message.author_id
    }));
  }

  const relatedProduct = await api.getProducts([ chat.product_id ]);

  return (
    <Chat
      uid={uid}
      chat_id={chat_id}
      serverMessages={filteredMessages}
      anotherPersonName={anotherPersonName}
      product={relatedProduct![0]}
    />
  );
}

async function getUserName(id: string) {
  const supabase = createServerComponentSupabaseClient();

  const { data } = await supabase.rpc('get_user_name', { userid: id});

  return data;
}