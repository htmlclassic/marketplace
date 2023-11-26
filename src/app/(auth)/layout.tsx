import { getAPI } from "@/supabase/api";
import { createServerComponentSupabaseClient } from "@/supabase/utils_server";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const api = getAPI(createServerComponentSupabaseClient());
  const session = await api.getSession();

  if (session) redirect('/');

  return (
    <div className="grow flex items-center justify-center">
      {children}
    </div>
  );
}