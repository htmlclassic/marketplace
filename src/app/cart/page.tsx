import { getAPI } from "@/supabase/api";
import { createServerComponentSupabaseClient } from "@/supabase/utils_server";
import { redirect } from "next/navigation";

import PageClient from "./pageClient";
import EmptyCart from "./components/EmptyCart";

export type CartState = Cart & {
  price: number;
  maxQuantity: number;
};

export default async function Page() {
  const api = getAPI(createServerComponentSupabaseClient());
  const session = await api.getSession();
  const uid = await api.getCurrentUserId();
  
  if (!session) redirect('/login');

  const itemsInCart = await api.getCartItems();

  if (!itemsInCart) return <EmptyCart />
  
  const userBalance = (await api.getCurrentUserProfileData())!.balance;
  const cart: CartState[] = [];
  const products =
    ( await Promise.all(itemsInCart!.map(product => api.getProductById(product.product_id))) )
      .filter(product => product) as Product[];

  // form cart state
  for (const product of products) {
    const item = itemsInCart.find(i => i.product_id === product.id);

    if (item) {
      cart.push({
        ...item,
        price: product.price,
        maxQuantity: product.quantity
      });
    }
  }

  return (
    <PageClient
      products={products}
      cart={cart}
      userBalance={userBalance}
      uid={uid!}
    />
  );
}