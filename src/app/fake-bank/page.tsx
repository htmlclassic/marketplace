import { createServerComponentSupabaseClient } from "@/supabase/utils_server";
import Client from "./Client";

interface Props {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Page({ searchParams }: Props) {
  const orderId = Number(searchParams.orderid);

  if (!orderId) return (
    <p className="text-sm text-red-400">
      Произошла ошибка. Попробуйте снова.
    </p>
  );

  return (
    <Client orderId={orderId} />
  );
}