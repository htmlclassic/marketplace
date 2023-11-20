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
  const products = (await api.getProducts(itemsInCart.map(item => item.product_id))) as Product[];

  const cart: CartState[] = [];
  const itemsQuantityChanged: string[] = [];
  // form cart state
  for (const product of products) {
    const item = itemsInCart.find(i => i.product_id === product.id);

    if (item) {
      // if products' quantity in marketplace became less than user has in the cart
      // display a message about it and change item's quantity in the user's cart
      if (item.quantity > product.quantity) {
        item.quantity = product.quantity;
        itemsQuantityChanged.push(item.product_id);

        await api.setCartItemQuantity(item.product_id, product.quantity);
      }

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
      itemsQuantityChanged={itemsQuantityChanged}
      userBalance={userBalance}
      uid={uid!}
    />
  );
}