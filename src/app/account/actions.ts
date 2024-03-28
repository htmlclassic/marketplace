'use server';

import { getAPI } from "@/supabase/api";
import { createOtherSupabaseClient } from "@/supabase/utils_server";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export async function editProfileAction(formData: FormData) {
  const supabase = createOtherSupabaseClient();
  const api = getAPI(supabase);

  const uid = await api.getCurrentUserId();

  if (!uid) throw new Error('Current user not authorized');

  const email = String(formData.get('email'));
  const name = String(formData.get('name'));
  const birthdate = String(formData.get('birthdate'));
  const birthdateFormatted = birthdate !== ''
      ? dayjs(birthdate, 'DD/MM/YYYY').format('YYYY-MM-DD')
      : null;

  const { error } = await supabase
    .from('profile')
    .update({
      email, name, birthdate: birthdateFormatted
    })
    .eq('id', uid);

  if (error) throw new Error(error.message);
};