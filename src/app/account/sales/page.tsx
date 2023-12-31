import { getAPI } from "@/supabase/api";
import { createOtherSupabaseClient } from "@/supabase/utils_server";
import Table from "./Table";

export default async function Page() {
  const api = getAPI(createOtherSupabaseClient())
  const stats = await api.getSellerStatistics();

  if (!stats)
    return (
      <div className="grow flex items-center justify-center text-center">
        <p>Ни один из ваших товаров ещё не купили. Статистика недоступна.</p>
      </div>
    );

  return (
    <div className="flex w-full overflow-x-auto">
      <Table stats={stats} />
    </div>
  );
}
