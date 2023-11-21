import { createServerComponentSupabaseClient } from "@/supabase/utils_server";
import AddProduct from "./AddProduct";

export default async function Page() {
  const supabase = createServerComponentSupabaseClient();

  const { data: categories } = await supabase
    .from('category')
    .select();

  return (
    <AddProduct categories={categories!.map(catName => catName.name)}/>
  );
}