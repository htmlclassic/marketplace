import { revalidate } from '@/src/utils';
import type { SupabaseClient } from '@supabase/supabase-js';

import dayjs from 'dayjs';

// if you query data from some table and you don't pass RLS policies conditions,
// supabase returns an empty array
function removeArrayDuplicates<T>(arr: T[]) {
  return Array.from(new Set<T>(arr));
}

export function getAPI(supabase: SupabaseClient<Database>) {
  return {
    async getProducts(ids?: string[]) {
      if (ids) ids = removeArrayDuplicates(ids);

      const { data: products, error } = 
        ids
        ?
          await supabase
            .from('product')
            .select()
            .filter('id', 'in', `(${ids.join()})`)
            .order('created_at', { ascending: false })
        :
          await supabase
            .from('product')
            .select()
            .order('created_at', { ascending: false });
    
      if (error) throw new Error(error.message);
      if (products.length === 0) return null;
      
      const imageUrls = await Promise.all(
        products.map(product => this.getImageUrlsByProductId(product.id))
      );

      const newProducts: Product[] = products.map((product, index) => (
        {
          ...product,
          imageUrls: imageUrls[index]
        }
      ));

      return newProducts;
    },

    async getImageUrlsByProductId(productId: string) {
      const { data } = await supabase
        .storage
        .from('images')
        .list(productId, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
      });
      
      let imageSources: string[] = [];

      if (data) {
        const imageURLs = data.map(item => productId + '/' + item.name);
    
        for (const url of imageURLs) {
          const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(url);
        
          if (data) {
            imageSources.push(publicUrl);
          }
        }
      }
    
      return imageSources.length ? imageSources : null;
    },

    async getSession() {
      const { data: { session } } = await supabase.auth.getSession();

      return session;
    },

    async getCurrentUserId() {
      const { data: { user } } = await supabase.auth.getUser();
      
      return user ? user.id : null;
    },

    async getCurrentUserProfileData(userId?: string | null) {
      const uid = userId || await this.getCurrentUserId();

      if (uid) {
        const { data } = await supabase.from('profile').select().eq('id', uid);

        return data ? data[0] : null;
      }

      return null;
    },

    async deleteProduct(productId: string) {
      const uid = await this.getCurrentUserId();

      if (uid) {
        await supabase.from('product').delete().eq('id', productId);

        this.deleteProductImages(productId);

        return true;
      }

      return false;
    },

    async deleteProductImages(productId: string) {
      const uid = await this.getCurrentUserId();

      if (uid) {
        const imgNames: string[] = [];

        const { data } = await supabase
          .storage
          .from('images')
          .list(productId, {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
          })

        if (data) {
          data.forEach(img => imgNames.push(img.name))
        }

        for (const imgName of imgNames) {
          supabase.storage.from('images').remove([productId + '/' + imgName]);
        }

        return true;
      }

      return false;
    },

    async addToCart(productId: string, quantity?: number) {
      const uid = await this.getCurrentUserId();

      if (uid) {
        const productsInCart = await this.getCartItems();

        if (productsInCart && productsInCart.find(item => item.product_id === productId)) return true;

        await supabase
          .from('cart')
          .insert({ user_id: uid, product_id: productId, quantity: quantity || 1 });

        revalidate('/cart');

        return true;
      }

      return false;
    },

    async deleteFromCart(productId: string, userId?: string | null) {
      const uid = userId || await this.getCurrentUserId();

      if (uid) {
        await supabase
          .from('cart')
          .delete()
          .eq('user_id', uid)
          .eq('product_id', productId);

        revalidate('/cart');

        return true;
      }

      return false;
    },

    async clearCart() {
      const uid = await this.getCurrentUserId();

      if (uid) {
        const { error } = await supabase
          .from('cart')
          .delete()
          .eq('user_id', uid);

        if (!error) return true;
      }

      return false;
    },

    async getCartItems(userId?: string | null) {
      const uid = userId || await this.getCurrentUserId();

      if (uid) {
        const { data } = await supabase
          .from('cart')
          .select('product_id, quantity')
          .eq('user_id', uid)
          .order('product_id', { ascending: false });

        if (data?.length) return data as Cart[];
      }

      return null;
    },

    async setCartItemQuantity(productId: string, quantity: number) {
      const { error } = await supabase
        .from('cart')
        .update({ quantity })
        .eq('product_id', productId);

      revalidate('/cart');

      return !error;
    },

    async setUserBalance(uid: string, newBalance: number) {
      const { error } = await supabase
          .from('profile')
          .update({ balance: newBalance })
          .eq('id', uid);
    },

    async getOrders() {
      const uid = await this.getCurrentUserId();

      if (uid) {
        let ordersResult: Order[] = [];

        // get name of a receiver
        const { username, first_name, last_name } = (await this.getCurrentUserProfileData())!;
        let receiver = username;

        if (first_name && last_name) receiver = first_name + ' ' + last_name;
        else if (first_name) receiver = first_name;
        else if (last_name) receiver = last_name;

        const {error: fetchOrdersError, data: orders } = await supabase
          .from('order_details')
          .select()
          .eq('user_id', uid)
          .order('created_at', { ascending: false });

        if (fetchOrdersError) throw new Error('Couldnt fetch orders: ' + fetchOrdersError.message);
        if (!orders.length) return null;

        const { error: fetchOrderItemsError, data: orderItems } = await supabase
          .from('order_items')
          .select()
          .filter('order_id', 'in', `(${orders.map(order => order.id).join()})`);

        if (fetchOrderItemsError) throw new Error('Couldnt fetch orders: ' + fetchOrderItemsError.message);

        const productIds = orderItems.map(orderItem => orderItem.product_id);
        const products = (await this.getProducts(productIds));

        if (!products) throw new Error('Coudnt fetch products');

        for (const order of orders) {
          const filteredOrderItems = orderItems.filter(orderItem => orderItem.order_id === order.id);

          const items: OrderItem[] = filteredOrderItems.map(orderItem => {
            const product = products.find(pr => pr.id === orderItem.product_id)!;

            return {
              price: orderItem.price,
              quantity: orderItem.quantity,
              product
            };
          });

          // set fake delivery status
          let status: 'seller' | 'courier' | 'done';
          const dateDiff = dayjs(order.delivery_date).diff(dayjs(), 'day', true);

          if (dateDiff <= 0) status = 'done';
          else if (dateDiff < 2) status = 'courier';
          else status = 'seller';

          ordersResult.push({
            id: order.id,
            deliveryDate: order.delivery_date,
            address: order.address,
            createdAt: order.created_at,
            status,
            receiver,
            items
          });
        }

        return ordersResult.length ? ordersResult : null;
      }

      return null;
    },

    async getSellerStatistics() {
      const uid = await this.getCurrentUserId();

      if (!uid) throw new Error('User is not authorized.');

      const { data: soldItems } = await supabase
        .from('order_items')
        .select();

      const stats: SellerStatistics[] = [];

      for (const item of soldItems!) {
        const productInStats = stats.find(pr => pr.product.id === item.product_id);

        if (productInStats) {
          productInStats.grossPay += item.price;
          productInStats.soldCount += item.quantity;
        } else {
          const product = (await this.getProducts([ item.product_id ]))![0];

          if (product.owner !== uid) continue;

          stats.push({
            product,
            soldCount: item.quantity,
            grossPay: item.price
          });
        }
      }

      return stats.length ? stats : null;
    },

    async getOwnedProducts() {
      const uid = await this.getCurrentUserId();

      if (uid) {
        const { data } = await supabase
          .from('product')
          .select()
          .eq('owner', uid);

        if (data?.length) return data;
      }

      return null
    },
  };
}