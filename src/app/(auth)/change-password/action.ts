'use server';

import { getAPI } from "@/supabase/api";
import { createOtherSupabaseClient } from "@/supabase/utils_server";

async function changePassword(formData: FormData) {
  const supabase = createOtherSupabaseClient();
  const api = getAPI(supabase);

  const oldPassword = String(formData.get('old_password'));
  const newPassword = String(formData.get('new_password'));

  const oldPasswordVerified = await api.verifyUserPassword(oldPassword);

  if (!oldPasswordVerified) return false;

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  return !error;
}