import { createClientSupabaseClient } from '@/supabase/utils_client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// export function useRealtimeCartUpdate() {
//   const supabase = createClientSupabaseClient();
//   const router = useRouter();

//   useEffect(() => {
//     const channel = supabase.channel('realtime cart').on(
//       'postgres_changes', {
//         event: '*',
//         schema: 'public',
//         table: 'cart'
//       }, () => {
//         router.refresh();
//       }
//     )
//     .subscribe();

//     return () =>  { supabase.removeChannel(channel) };
//   }, []);
// }