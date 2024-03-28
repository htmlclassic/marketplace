'use server';

import { createServiceSupabaseClient } from "@/supabase/utils_server";

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Errors, FormDataType, FormDataZodSchema, Inputs, StrippedCartItem } from "./types";
import { unstable_noStore } from "next/cache";
import { parsePhoneNumber } from "libphonenumber-js";

dayjs.extend(customParseFormat);


/* 
  In this function serviceSupabaseClient is used, so
  ALWAYS FILTER QUERIES HERE IN THE CODE BY USER ID
*/
export default async function buyItems(
  uid: string | null,
  data: Inputs,
  cart: StrippedCartItem[]
) {
  unstable_noStore();

  const supabase = createServiceSupabaseClient();

  const isValid = FormDataZodSchema.safeParse(data).success;
  let formData: FormDataType;

  if (isValid) formData = data as FormDataType;
  else throw new Error('Couldnt validate form data');

  // format phone number to (+7 222-22-22)
  const parsedPhoneNumber = parsePhoneNumber(formData.phoneNumber, 'RU');
  const formattedPhoneNumber = parsedPhoneNumber.formatInternational();
  formData.phoneNumber = formattedPhoneNumber;

  if (cart.length === 0) throw new Error(Errors.EMPTY_CART);
  
  const products = await getProductsByIds(cart.map(item => item.product.id));
  let orderId: number | undefined;

  if (!products) throw new Error(Errors.PRODUCTS_DONT_EXIST);

  // check if there's still enough amount of products to buy
  if (!checkProductsAvailability(cart, products))
    throw new Error(Errors.PRODUCTS_QUANTITY_CHANGED);

  const { data: customerWallet } = await supabase
    .from('wallet')
    .select('id, balance')
    .eq('user_id', uid!)
    .limit(1)
    .single();

  const customerBalance = customerWallet?.balance || 0;
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

    // substract product's quantity
    await supabase
      .from('product')
      .update({ quantity: product.quantity - cartItem.quantity})
      .eq('id', product.id);
    
    if (formData.paymentType === 'marketplace') {
      // get product's owner wallet
      const { data: sellerWalletId } = await supabase
        .from('wallet')
        .select('id')
        .eq('user_id', product.owner)
        .limit(1)
        .single();

      // deposit on product's owner wallet
      await supabase
        .rpc('deposit_on_wallet', {
          wallet_id: sellerWalletId!.id,
          sum: price, 
          action: 'sold_product' 
        });
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

  if (formData.paymentType === 'marketplace') {
    // withdraw from customer's balance
    await supabase
      .rpc('withdraw_from_wallet', { wallet_id: customerWallet!.id, sum: totalSumToPay });
  }

  return orderId;

  type StrippedProducts = NonNullable<Awaited<ReturnType<typeof getProductsByIds>>>;

  // helper functions
  async function getProductsByIds(ids: string[]) {
    const { data: products } = await supabase
      .from('product')
      .select('id, price, quantity, owner')
      .filter('id', 'in', `(${ids.join(',')})`);

    return products;
  }

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