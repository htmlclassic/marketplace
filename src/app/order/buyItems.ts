'use server';

import { getAPI } from "@/supabase/api";
import { createServiceSupabaseClient } from "@/supabase/utils_server";

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Errors, FormDataType, FormDataZodSchema, Inputs, StrippedCartItem } from "./types";
import { unstable_noStore } from "next/cache";
import { parsePhoneNumber } from "libphonenumber-js";

dayjs.extend(customParseFormat);

export default async function buyItems(
  uid: string | null,
  data: Inputs,
  cart: StrippedCartItem[]
) {
  unstable_noStore();

  const isValid = FormDataZodSchema.safeParse(data).success;
  let formData: FormDataType;

  if (isValid) formData = data as FormDataType;
  else throw new Error('Couldnt validate form data');

  // format phone number to (+7 222-22-22)
  const parsedPhoneNumber = parsePhoneNumber(formData.phoneNumber, 'RU');
  const formattedPhoneNumber = parsedPhoneNumber.formatInternational();
  formData.phoneNumber = formattedPhoneNumber;

  const supabase = createServiceSupabaseClient();
  const api = getAPI(supabase);

  if (cart.length === 0) throw new Error(Errors.EMPTY_CART);
  
  const products = await getProductsByIds(cart.map(item => item.product.id));
  let orderId: number | undefined;

  if (products) {
    // check if there's still enough amount of products to buy
    if (checkProductsAvailability(cart, products)) {
      let customerBalance = (await api.getCurrentUserProfileData(uid))?.balance ?? 0;
      const totalSumToPay = getSumToPay(cart, products);

      if (formData.paymentType === 'marketplace' && customerBalance < totalSumToPay) {
        throw new Error(Errors.LOW_BALANCE);
      }

      // create order and get its id
      const { data: order } = await supabase
        .from('order')
        .insert({
          user_id: uid,
          delivery_date: dayjs().add(4, 'day').format('YYYY-MM-DD'),
          address: formData.address,
          receiver_name: formData.receiverName,
          email: formData.email,
          phone_number: formData.phoneNumber
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
          payment_type: formData.paymentType,
          is_paid: formData.paymentType === 'marketplace'
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

        if (formData.paymentType === 'marketplace' && uid && !selfBuy) {
          customerBalance -= price;
        }

        // substract product's quantity
        await supabase
          .from('product')
          .update({ quantity: product.quantity - cartItem.quantity})
          .eq('id', product.id);
        
        if (formData.paymentType === 'marketplace' && uid && !selfBuy) {
          // withdraw from customer's account
          await supabase
            .from('profile')
            .update({ balance: customerBalance })
            .eq('id', uid);
        }
        
        if (formData.paymentType === 'bank_card' || !selfBuy) {
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
    const { data: products } = await supabase
      .from('product')
      .select('id, price, quantity, owner')
      .filter('id', 'in', `(${ids.join(',')})`);

    return products;
  }

  type StrippedProducts = NonNullable<Awaited<ReturnType<typeof getProductsByIds>>>;

  function checkProductsAvailability(cartItems: StrippedCartItem[], products: StrippedProducts) {
    for (const item of cartItems) {
      const product = products.find(pr => pr.id === item.product.id)!;

      if (item.quantity > product.quantity) return false;
    }

    return true;
  }

  function getSumToPay(cartItems: StrippedCartItem[], products: StrippedProducts) {
    const total = cartItems.reduce((acc, cartItem) => {
      const product = products.find(pr => pr.id === cartItem.product.id)!;

      return cartItem.quantity * product.price + acc;
    }, 0);

    return total;
  }
  // end of helper function
}