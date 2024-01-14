/*
1) выбрать адрес доставки.
  -выбрать способ оплаты: либо картой, либо с баланса (если авторизован).
  -выбрать дату доставки
  кнопка "оплатить онлайн" (если юзер не авторизован, то дополнительно попросить email для отсылки туда
  трек-кода заказа)
3) - если карта, то перекинуть на фейк страницу заполнения карточных данных. после заполнения и самбита. купить товары.

*/

import { getAPI } from "@/supabase/api";
import { createServerComponentSupabaseClient } from "@/supabase/utils_server";
import PageClient from "./pageClient";

export default async function Page() {
  const api = getAPI(createServerComponentSupabaseClient());
  const uid = await api.getCurrentUserId();

  return (
    <PageClient uid={uid} />
  );
}