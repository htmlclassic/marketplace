import { getAPI } from "@/supabase/api";
import { createServerComponentSupabaseClient } from "@/supabase/utils_server";
import PageClient from "./pageClient";

// this route should be protected
// you can be redirected here from /cart if your cart isnt empty, no way else
export default async function Page() {
  const supabase = createServerComponentSupabaseClient();
  const api = getAPI(supabase);
  const uid = await api.getCurrentUserId();
  let marketplaceBalance = 0;

  if (uid) {
    const { data } = await supabase
      .from('wallet')
      .select('balance')
      .limit(1)
      .single();

    if (data) marketplaceBalance = data.balance;
  }

  return (
    <PageClient
      uid={uid}
      marketplaceBalance={marketplaceBalance}
    />
  );
}