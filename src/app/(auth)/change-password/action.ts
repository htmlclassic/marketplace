'use server';

import { getAPI } from "@/supabase/api";
import { createOtherSupabaseClient } from "@/supabase/utils_server";
import { z } from "zod";
import { formSchema } from "./types";

export async function changePassword(values: z.infer<typeof formSchema>) {
  const supabase = createOtherSupabaseClient();
  const api = getAPI(supabase);

  const isValid = formSchema.safeParse(values).success;

  if (!isValid) return false;

  const oldPassword = values.old_password;
  const newPassword = values.new_password;

  const oldPasswordVerified = await api.verifyUserPassword(oldPassword);

  if (!oldPasswordVerified) return false;

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  return !error;
}