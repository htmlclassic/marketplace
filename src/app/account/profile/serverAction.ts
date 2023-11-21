'use server';

import { getAPI } from "@/supabase/api";
import { createOtherSupabaseClient } from "@/supabase/utils_server";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export default async function handleSubmit(formData: FormData) {
  const supabase = createOtherSupabaseClient();
  const api = getAPI(supabase);

  const userId = await api.getCurrentUserId();

  if (!userId) throw new Error('Current user not authorized');

  const balance = Number(formData.get('balance'));
  const username = String(formData.get('username'));
  const first_name = String(formData.get('first_name'));
  const last_name = String(formData.get('last_name'));
  const birthdate = String(formData.get('birthdate'));
  const birthdateFormatted = 
    birthdate !== ''
      ? dayjs(birthdate, 'DD/MM/YYYY').format('YYYY-MM-DD')
      : null;

  const { error } = await supabase.from('profile')
    .update({
      username, first_name, last_name, birthdate: birthdateFormatted, balance
    })
    .eq('id', userId);

  if (error) throw new Error(error.message);
};