import { createOtherSupabaseClient } from '@/supabase/utils_server';
import { NextResponse } from 'next/server';

// validate data(!!!)
export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const first_name = String(formData.get('first_name'));
  const last_name = String(formData.get('last_name'));
  const supabase = createOtherSupabaseClient();

  if (!first_name.trim()) {
    return NextResponse.redirect(
      `${requestUrl.origin}/signup?error=Поле 'Имя' пустое`,
      { status: 301}
    );
  }

  if (!last_name.trim()) {
    return NextResponse.redirect(
      `${requestUrl.origin}/signup?error=Поле 'Фамилия' пустое`,
      { status: 301}
    );
  }

  const { data: { user }, error } = await supabase.auth.signUp({
    email,
    password,
    // options: {
    //   emailRedirectTo: `${requestUrl.origin}/auth/callback`,
    // },
  })

  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=Could not authenticate user`,
      { status: 301}
    );
  } else {
    const uid = user!.id;

    const { error } = await supabase
      .from('profile')
      .update({ first_name, last_name })
      .eq('id', uid);

    if (error) throw new Error(error.message);
  }

  return NextResponse.redirect(
    requestUrl.origin,
    {
      // a 301 status is required to redirect from a POST to a GET route
      status: 301,
    }
  )
}
