import { createServerComponentSupabaseClient } from '@/supabase/utils_server';
import { redirect } from 'next/navigation';
import ClientWrapper from './ClientWrapper';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  return (
    <ClientWrapper>
      {children}
    </ClientWrapper>
  );
}
