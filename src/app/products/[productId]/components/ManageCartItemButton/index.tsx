import { createServerComponentSupabaseClient } from "@/supabase/utils_server";
import ManageCartItemButtonClient from "./ManageCartItemButton";
import { getAPI } from "@/supabase/api";

interface Props {
  productId: string;
}

export default async function ManageCartItemButton({ productId }: Props) {
  const api = getAPI(createServerComponentSupabaseClient());
  const cartItem =  (await api.getCartItems())?.find(item => item.product_id === productId);
  const inCart = !!cartItem;
  const quantityInCart = cartItem?.quantity || 1;
  const maxQuantity = ( await api.getProducts([productId]) )?.[0].quantity || 0;

  return (
    <ManageCartItemButtonClient 
      productId={productId}
      inCart={inCart}
      quantity={quantityInCart}
      maxQuantity={maxQuantity}
    />
  )
}