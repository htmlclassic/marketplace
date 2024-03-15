'use server';

import { createOtherSupabaseClient } from "@/supabase/utils_server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { signupFormSchema } from "./types";

export async function signIn(formData: FormData) {
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  const supabase = createOtherSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent('Неверная почта или пароль')}`);
  }

  redirect('/');
}

export async function signOut() {
  const supabase = createOtherSupabaseClient();
  await supabase.auth.signOut()

  redirect('/');
}

export async function signUp(data: z.infer<typeof signupFormSchema>) {
  const supabase = createOtherSupabaseClient();
  
  if (!signupFormSchema.safeParse(data).success) {
    redirect(`/signup?error=${encodeURIComponent('Поля формы не прошли валидацию')}`);
  }

  const { data: { user }, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent('Ошибка аутентификации')}`);
  } else {
    const uid = user!.id;

    const { error } = await supabase
      .from('profile')
      .update({ name: data.name })
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

  redirect(`/signup?error=${encodeURIComponent('Ошибка входа с помощью GitHub')}`);
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

  redirect(`/signup?error=${encodeURIComponent('Ошибка входа с помощью Google')}`);
}