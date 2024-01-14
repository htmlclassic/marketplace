import { getAPI } from "@/supabase/api";
import { createServerComponentSupabaseClient } from "@/supabase/utils_server";

import PageClient from "./pageClient";

export default async function Page() {
  const api = getAPI(createServerComponentSupabaseClient());
  const uid = await api.getCurrentUserId();

  return (
    <PageClient uid={uid} />
  );
}