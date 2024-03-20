'use client';

// probably I should move datapicker providers to individual routes?
import { LocalizationProvider } from '@mui/x-date-pickers';
import { ruRU } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import 'dayjs/locale/ru';
import CartContextProvider from '../CartContext';
import { useEffect } from 'react';
import { createClientSupabaseClient } from '@/supabase/utils_client';
import { useRouter } from 'next/navigation';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient();

interface Props {
  children: React.ReactNode;
  initialCart: CartItem[];
  uid: string | null;
}

export default function ClientWrapper({ children, initialCart, uid }: Props) {
  const router = useRouter();

  /*
    After supabase.auth.signInWithOAuth(provider: 'google' | 'github'), Supabase redirects to /
    On the client session now exists, but in my server component /account/layout.tsx
    session is null. The layout redirects to /login page, because this is protected route.
    Idk why, but /login sees that session is TRUE and redirects back to root.
    So my /account route doesn't see the session, but /login sees it.

    In short, after sign in via some provider, you can't visit /account route even though
    you signed in successfully.

    The solution: on initial website load I do router.refresh(), so /account can see session now.
    Have no idea how it workы, but it works.

    P.s. maybe this is because <Link href="/account"> prefetches the route before session is loaded?
  */
  useEffect(() => {
    const supabase = createClientSupabaseClient();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') {
        router.refresh();
      }
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return (
      <QueryClientProvider client={queryClient}>
        <CartContextProvider initialCart={initialCart} uid={uid}>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="ru"
            localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
          >
            {children}
          </LocalizationProvider>
        </CartContextProvider>
      </QueryClientProvider>
  );
}