'use server';

import { revalidate } from "@/src/utils";
import { getAPI } from "@/supabase/api";
import { createServiceSupabaseClient } from "@/supabase/utils_server";

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

/*

1) получить итемы из корзины в виде { product_id, quantity }
2) корзина это охуенно. но вдруг что-то поменялось а корзина затупила проверить наличие товара. если чёт не совпадает - вывести сообщение что чет блядь поменялось.
3) получить баланс покупателя
4) получить цены на все продукты в корзине. (лучше собрать из этог массив, чтобы опять не слать запросы)
5) перемножить ценники на количество итемов и удостовериться, что у покупателя хватает бабок на все товары
  -если не хватает бабок, то написать "чел, не хватает бабок на все итемы, чек свой баланс"

окей. мы узнали, что товар в наличии, сколько всего бабок проебет покупатель и мы знаем что у чела есть эти бабки.
пора начать покупочки.

идем по каждому товару в цикле:
  - вычитаем количество у товара
  - отдаем продавцу бабки
  - а скок бабок уйдет у покупателя в итоге на все товары - просто аккумулируем в переменной. в конце забрать. ps. нихуя. читать ниже.
  (а что если серв упадет на втором товаре? дадим бабки продавану а у покупателя не спишем?)
  (наверно всё-таки стоит сразу забирать бабки в цикле. дальше если че подумаем об оптимизации запросов)
  - всё ок? revalidate + redirect
  в итоге покупатель проебал бабки. продавец заработал. товара стало меньше. но куда пропал товар лол?
  поэтому надо будет по пути /orders расположить купленные товарчики. в бд хз, отдельную таблицу сделать?
  подписать дату доставки через несколько дней или сразу получено. чтобы наглядно.
*/

/* CONSIDER */
/*
  IF product is yours, you can't buy it :)
*/

export default async function buyItems(uid: string, address: string) {
  const supabase = createServiceSupabaseClient();
  const api = getAPI(supabase);

  if (address === '') throw new Error('Address must not be empty!');

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
    const itemsQuantity = cartItems.reduce((acc, el) => acc + el.quantity , 0)
    const productsQuantity = products.reduce((acc, el) => acc + el.quantity , 0)

    return itemsQuantity <= productsQuantity;
  }

  function getSumToPay(cartItems: Cart[], products: Product[]) {
    const total = cartItems.reduce((acc, cartItem) => {
      const product = products.find(pr => pr.id === cartItem.product_id)!;

      return cartItem.quantity * product.price + acc;
    }, 0);

    return total;
  }
  // end of function

  const cartItems = await api.getCartItems(uid); // product_id, quantity

  if (cartItems) {
    const products = await getProductsByIds(cartItems.map(item => item.product_id));

    if (products) {
      // check if there's still enough amount of products to buy
      if (checkProductsAvailability(cartItems, products)) {
        let customerBalance = (await api.getCurrentUserProfileData(uid))!.balance;
        const totalSumToPay = getSumToPay(cartItems, products);

        if (customerBalance < totalSumToPay)
          throw new Error('You dont have enough money to buy all the items in the cart');

        // create order and get its id
        const { data: order, error } = await supabase
          .from('order_details')
          .insert({
            user_id: uid,
            delivery_date: dayjs().add(4, 'day').format('YYYY-MM-DD'),
            address
          }).select('id');
        
        const orderId = order?.[0].id;

        if (!orderId) throw new Error('Couldn\'t create an order: ' + error!.message);

        for (const cartItem of cartItems) {
          const product = products.find(pr => pr.id === cartItem.product_id)!;

          if (product.owner === uid) {
            throw new Error('You can\'t buy your own products.')
          }

          const price = cartItem.quantity * product.price;
          customerBalance -= price;

          // what if seller deletes their account from marketplace?
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

        await api.clearCart(uid);
        revalidate('/');
        
        return true;
        
      } else {
        throw new Error('Products quantity in DB has changed');
      }
      
    } else {
      throw new Error('Cart contain products that dont exist in db. Aborting...');
    }
  }
}