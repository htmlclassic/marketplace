import { createServerComponentSupabaseClient } from '@/supabase/utils_server';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  return (
    <div className="side-padding flex grow">
      { children }
    </div>
  );
}
