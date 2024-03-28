import { SupabaseClient } from "@supabase/supabase-js";

export async function getChats(supabase: SupabaseClient<Database>) {
  const { data: chats } = await supabase
    .from('chat')
    .select(`
      id,
      customer_id,
      seller_name,
      customer_name,

      chat_message(
        text,
        created_at,
        author_id
      ),
      product(
        id,
        title,
        img_urls
      )
    `);

  return chats?.length ? chats : null;
}