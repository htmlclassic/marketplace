import { createServerComponentSupabaseClient, createServiceSupabaseClient } from "@/supabase/utils_server";
import Client from "./Client";

export const dynamic = 'force-dynamic';

interface Props {
  params: { orderid: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ params }: Props) {
  const supabaseService = createServiceSupabaseClient();

  const supabaseServer = createServerComponentSupabaseClient();
  const { data: { session } } = await supabaseServer.auth.getSession();

  const orderId = Number(params.orderid);

  const { data: order } = await supabaseService
    .from('order')
    .select(`
      cancelled,
      order_items(price, quantity),
      order_payment_details(is_paid)
    `)
    .eq('id', orderId)
    .limit(1)
    .single();

  if (!orderId || !order) return (
    <p className="text-sm text-red-400">
      Произошла ошибка. Попробуйте снова.
    </p>
  );

  if (order.cancelled || order.order_payment_details[0].is_paid) {
    return (
      <p className="text-sm text-red-400">Транзакция больше не валидна.</p>
    );
  }

  const sumToPay =
    order.order_items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Client 
      orderId={orderId} 
      sumToPay={sumToPay} 
      session={Boolean(session)}
    />
  );
}