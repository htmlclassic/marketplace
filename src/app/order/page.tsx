import { getAPI } from "@/supabase/api";
import { createServerComponentSupabaseClient } from "@/supabase/utils_server";
import PageClient from "./pageClient";

// this route should be protected
// you can be redirected here from /cart if your cart isnt empty, no way else
export default async function Page() {
  const api = getAPI(createServerComponentSupabaseClient());
  const uid = await api.getCurrentUserId();
  let marketplaceBalance = 0;

  if (uid) {
    const profileData = await api.getCurrentUserProfileData();

    if (profileData) marketplaceBalance = profileData.balance;
  }

  return (
    <PageClient
      uid={uid}
      marketplaceBalance={marketplaceBalance}
    />
  );
}