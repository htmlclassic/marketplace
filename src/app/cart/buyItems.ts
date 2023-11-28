'use server';

import { getAPI } from "@/supabase/api";
import { createServiceSupabaseClient } from "@/supabase/utils_server";

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Errors } from "./enums";
import { unstable_noStore } from "next/cache";

dayjs.extend(customParseFormat);

export default async function buyItems(uid: string, address: string) {
  unstable_noStore();

  const supabase = createServiceSupabaseClient();
  const api = getAPI(supabase);

  if (address === '') throw new Error(Errors.EMPTY_ADDRESS);

  const cartItems = await api.getCartItems(uid); // product_id, quantity

  if (!cartItems) throw new Error(Errors.EMPTY_CART);
  
  const products = await getProductsByIds(cartItems.map(item => item.product_id));

  if (products) {
    // check if user tries to buy their own product
    for (const product of products) {
      if (product.owner === uid) {
        throw new Error(Errors.USER_OWNS_PRODUCT)
      }
    }

    // check if there's still enough amount of products to buy
    if (checkProductsAvailability(cartItems, products)) {
      let customerBalance = (await api.getCurrentUserProfileData(uid))!.balance;
      const totalSumToPay = getSumToPay(cartItems, products);

      if (customerBalance < totalSumToPay)
        throw new Error(Errors.LOW_BALANCE);

      // create order and get its id
      const { data: order, error } = await supabase
        .from('order_details')
        .insert({
          user_id: uid,
          delivery_date: dayjs().add(4, 'day').format('YYYY-MM-DD'),
          address
        }).select('id');
      
      const orderId = order![0].id;

      for (const cartItem of cartItems) {
        const product = products.find(pr => pr.id === cartItem.product_id)!;

        const price = cartItem.quantity * product.price;
        customerBalance -= price;

        const seller = (await supabase
          .from('profile')
          .select()
          .eq('id', product.owner))
          .data![0];

        // substract product's quantity
        await supabase
          .from('product')
          .update({ quantity: product.quantity - cartItem.quantity})
          .eq('id', product.id);
        
        // withdraw from customer's account
        await supabase
          .from('profile')
          .update({ balance: customerBalance })
          .eq('id', uid)
        
        // deposit on seller's account
        await supabase
          .from('profile')
          .update({ balance: seller.balance + price })
          .eq('id', seller.id);

        // create order_item
        await supabase
          .from('order_items')
          .insert({
            order_id: orderId,
            product_id: product.id,
            price: product.price,
            quantity: cartItem.quantity,
          });
      }
      
    } else {
      throw new Error(Errors.PRODUCTS_QUANTITY_CHANGED);
    }
    
  } else {
    throw new Error(Errors.PRODUCTS_DONT_EXIST);
  }

  // functions
  async function getProductsByIds(ids: string[]) {
    const products: Product[] = [];

    for (const id of ids) {
      const { data } = await supabase
        .from('product')
        .select()
        .eq('id', id);
      
      if (!data) return null;

      products.push(data[0] as Product);
    }

    return products;
  }

  function checkProductsAvailability(cartItems: Cart[], products: Product[]) {
    for (const item of cartItems) {
      const product = products.find(pr => pr.id === item.product_id)!;

      if (item.quantity > product.quantity) return false;
    }

    return true;
  }

  function getSumToPay(cartItems: Cart[], products: Product[]) {
    const total = cartItems.reduce((acc, cartItem) => {
      const product = products.find(pr => pr.id === cartItem.product_id)!;

      return cartItem.quantity * product.price + acc;
    }, 0);

    return total;
  }
  // end of function
}