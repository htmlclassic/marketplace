import { getAPI } from "@/supabase/api";
import { createOtherSupabaseClient } from "@/supabase/utils_server";
import Table from "./Table";
import { redirect } from "next/navigation";

export default async function Page() {
  const api = getAPI(createOtherSupabaseClient())
  const session = await api.getSession();
  
  if (!session) redirect('/login');

  const stats = await api.getSellerStatistics();

  if (!stats) return <p>Вы еще ничего не продавали. Статистика недоступна.</p>

  return (
    <div className="flex w-full overflow-x-auto">
      <Table stats={stats} />
    </div>
  );
}
