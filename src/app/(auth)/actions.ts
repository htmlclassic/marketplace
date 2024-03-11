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
  const name = String(formData.get('name'));
  const supabase = createOtherSupabaseClient();

  if (!name.trim()) {
    redirect(`/signup?error=${'Поле \'Имя\' пустое'}`);
  }

  const { data: { user }, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    redirect(`/signup?error=${'Could not authenticate user'}`);
  } else {
    const uid = user!.id;

    const { error } = await supabase
      .from('profile')
      .update({ name })
      .eq('id', uid);

    if (error) throw new Error(error.message);
  }

  redirect('/');
}

export async function signInWithGithub() {
  const supabase = createOtherSupabaseClient();

  const { data } = await supabase.auth.signInWithOAuth({
    provider: 'github'
  });

  if (data.url) {
    redirect(data.url);
  }

  redirect(`/signup?error=${'Could not sign in user via Github'}`);
}

export async function signInWithGoogle() {
  const supabase = createOtherSupabaseClient();

  const { data } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (data.url) {
    redirect(data.url);
  }

  redirect(`/signup?error=${'Could not sign in user via Github'}`);
}