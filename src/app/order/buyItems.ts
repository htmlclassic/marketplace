'use server';

import { getAPI } from "@/supabase/api";
import { createServiceSupabaseClient } from "@/supabase/utils_server";

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Errors } from "./types";
import { unstable_noStore } from "next/cache";

dayjs.extend(customParseFormat);

interface OrderDetails {
  paymentType: PaymentType;
  address: string;
  email: string;
  receiverName: string;
  phoneNumber?: string;
}

export default async function buyItems(
  uid: string | null,
  orderDetails: OrderDetails,
  cart: CartItem[]
) {
  unstable_noStore();

  const supabase = createServiceSupabaseClient();
  const api = getAPI(supabase);

  if (orderDetails.address === '') throw new Error(Errors.EMPTY_ADDRESS);
  if (cart.length === 0) throw new Error(Errors.EMPTY_CART);
  
  const products = await getProductsByIds(cart.map(item => item.product.id));
  let orderId: number | undefined;

  if (products) {
    // check if there's still enough amount of products to buy
    if (checkProductsAvailability(cart, products)) {
      let customerBalance = (await api.getCurrentUserProfileData(uid))?.balance ?? 0;
      const totalSumToPay = getSumToPay(cart, products);

      if (orderDetails.paymentType === 'marketplace' && customerBalance < totalSumToPay) {
        throw new Error(Errors.LOW_BALANCE);
      }

      // create order and get its id
      const { data: order } = await supabase
        .from('order')
        .insert({
          user_id: uid,
          delivery_date: dayjs().add(4, 'day').format('YYYY-MM-DD'),
          address: orderDetails.address,
          receiver_name: orderDetails.receiverName,
          email: orderDetails.email,
          phone_number: orderDetails.phoneNumber
        })
        .select('id')
        .single();
      
      orderId = order?.id;

      if (!orderId) throw new Error(Errors.CREATE_ORDER_ERROR);

      // create payment_details record
      await supabase
        .from('order_payment_details')
        .insert({
          order_id: orderId,
          payment_type: orderDetails.paymentType,
          is_paid: orderDetails.paymentType === 'marketplace'
        });

      for (const cartItem of cart) {
        // what if cart been populated somehow with fake product ids?
        // it'll cause the script to fall. stop using this fucking '!' everywhere
        const product = products.find(pr => pr.id === cartItem.product.id)!;
        const price = cartItem.quantity * product.price;

        const seller = (await supabase
          .from('profile')
          .select()
          .eq('id', product.owner))
          .data![0];
        
        // user buys an item from themself
        const selfBuy = uid === seller.id;

        if (orderDetails.paymentType === 'marketplace' && uid && !selfBuy) {
          customerBalance -= price;
        }

        // substract product's quantity
        await supabase
          .from('product')
          .update({ quantity: product.quantity - cartItem.quantity})
          .eq('id', product.id);
        
        if (orderDetails.paymentType === 'marketplace' && uid && !selfBuy) {
          // withdraw from customer's account
          await supabase
            .from('profile')
            .update({ balance: customerBalance })
            .eq('id', uid);
        }
        
        if (orderDetails.paymentType === 'bank_card' || !selfBuy) {
          // deposit on seller's account
          await supabase
            .from('profile')
            .update({ balance: seller.balance + price })
            .eq('id', seller.id);
        }

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

  return orderId;

  // helper functions
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

  function checkProductsAvailability(cartItems: CartItem[], products: Product[]) {
    for (const item of cartItems) {
      const product = products.find(pr => pr.id === item.product.id)!;

      if (item.quantity > product.quantity) return false;
    }

    return true;
  }

  function getSumToPay(cartItems: CartItem[], products: Product[]) {
    const total = cartItems.reduce((acc, cartItem) => {
      const product = products.find(pr => pr.id === cartItem.product.id)!;

      return cartItem.quantity * product.price + acc;
    }, 0);

    return total;
  }
  // end of helper function
}