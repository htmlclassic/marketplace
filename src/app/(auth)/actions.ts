'use server';

import { createOtherSupabaseClient } from "@/supabase/utils_server";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  const supabase = createOtherSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/login?error=${error.message}`);
  }

  redirect('/');
}

export async function signOut() {
  const supabase = createOtherSupabaseClient();
  await supabase.auth.signOut()

  redirect('/');
}

export async function signUp(formData: FormData) {
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const first_name = String(formData.get('first_name'));
  const last_name = String(formData.get('last_name'));
  const supabase = createOtherSupabaseClient();

  if (!first_name.trim()) {
    redirect(`/signup?error=${'Поле \'Имя\' пустое'}`);
  }

  if (!last_name.trim()) {
    redirect(`/signup?error=${'Поле \'Фамилия\' пустое'}`);
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
  });

  console.log('data:', data);
  console.log('error:', error)

  // const { data: { user }, error } = await supabase.auth.signUp({
  //   email,
  //   password
  // })

  // console.log(user);
  // console.log('error: ' + error)

  // if (error) {
  //   redirect(`/signup?error=${'Could not authenticate user'}`);
  // } else {
  //   const uid = user!.id;

  //   const { error } = await supabase
  //     .from('profile')
  //     .update({ first_name, last_name })
  //     .eq('id', uid);

  //   if (error) throw new Error(error.message);
  // }

  // redirect('/');
}