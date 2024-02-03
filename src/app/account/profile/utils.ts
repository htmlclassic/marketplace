import { getAPI } from "@/supabase/api";
import { createOtherSupabaseClient } from "@/supabase/utils_server";
import { cache } from "react";

// doesnt work?
export const getUserProfileData = cache(async () => {
  const api = getAPI(createOtherSupabaseClient());
  
  return await api.getCurrentUserProfileData();
})