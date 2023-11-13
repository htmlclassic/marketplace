import { getAPI } from "@/supabase/api";
import { createServerComponentSupabaseClient } from "@/supabase/utils_server";
import { redirect } from "next/navigation";
import AddProduct from "./AddProduct";

export default async function Page() {
  const api = getAPI(createServerComponentSupabaseClient());
  const session = await api.getSession();
  
  if (!session) redirect('/login');

  return (
    <AddProduct />
  );
}