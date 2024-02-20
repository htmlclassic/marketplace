import { createServerComponentSupabaseClient } from "@/supabase/utils_server";
import Form from "./components/Form";

export default async function Page() {
  const supabase = createServerComponentSupabaseClient();

  const { data: categories } = await supabase
    .from('category')
    .select();

  return (
    <Form categories={categories!.map(catName => catName.name)}/>
  );
}