import { createServerComponentSupabaseClient } from "@/supabase/utils_server";
import { redirect } from "next/navigation";
import AddProduct from "./AddProduct";

export default async function Page() {
  const supabase = createServerComponentSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) redirect('/login');

  const { data: categories } = await supabase
    .from('category')
    .select();

  return (
    <AddProduct categories={categories!.map(catName => catName.name)}/>
  );
}