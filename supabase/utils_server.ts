import { CookieOptions, createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export function createServiceSupabaseClient() {
  // when using this createClient from supabase-js
  // some of my queries were cached
  // i found this code on the internet to opt out of caching
  const createFetch =
    (options: Pick<RequestInit, "next" | "cache">) =>
    (url: RequestInfo | URL, init?: RequestInit) => {
      return fetch(url, {
        ...init,
        ...options,
      });
  };

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      },
      // global: {
      //   fetch: createFetch({
      //     cache: "no-store"
      //   })
      // }
    }
  );

  return supabase;
}

export function createServerComponentSupabaseClient() {
  const cookieStore = cookies();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  );

  return supabase;
}

export function createOtherSupabaseClient() {
  const cookieStore = cookies()

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  return supabase;
}