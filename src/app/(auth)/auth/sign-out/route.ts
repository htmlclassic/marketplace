import { createOtherSupabaseClient } from '@/supabase/utils_server';
import { NextResponse } from 'next/server';

// export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = createOtherSupabaseClient();

  await supabase.auth.signOut()

  return NextResponse.redirect(requestUrl.origin);
}
