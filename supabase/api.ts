import type { SupabaseClient } from '@supabase/supabase-js';
import dayjs from 'dayjs';
import throttle from 'lodash/throttle';

const THROTTLE_MS = 1000;

function removeArrayDuplicates<T>(arr: T[]) {
  return Array.from(new Set<T>(arr));
}

// if you query data from some table and you don't pass RLS policies conditions,
// supabase returns an empty array

export function getAPI(supabase: SupabaseClient<Database>) {
  const api =  {
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

      return products;
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

    async verifyUserPassword(password: string) {
      const { data } = await supabase.rpc('verify_user_password', { password });
    
      return Boolean(data);
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

    // wrap in throttle
    async addToCart(productId: string, quantity?: number) {
      const uid = await this.getCurrentUserId();

      if (uid) {
        const productsInCart = await this.getCartItems();

        if (productsInCart && productsInCart.find(item => item.product.id === productId)) return true;

        await supabase
          .from('cart')
          .insert({ user_id: uid, product_id: productId, quantity: quantity || 1 });

        return true;
      }

      return false;
    },

    // wrap in throttle
    async deleteFromCart(productId: string) {
      const uid = await this.getCurrentUserId();

      if (uid) {
        await supabase
          .from('cart')
          .delete()
          .eq('user_id', uid)
          .eq('product_id', productId);

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
          .select('quantity, product(*)')
          .eq('user_id', uid)
          .order('product_id', { ascending: false });

        if (data?.length) return data as CartItem[];
      }

      return null;
    },

    setCartItemQuantity: throttle(
      async function(productId: string, quantity: number) {
        const { error } = await supabase
          .from('cart')
          .update({ quantity })
          .eq('product_id', productId);
  
        // revalidate('/cart');
  
        return !error;
      }
    , THROTTLE_MS),

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

    async getUserName(id: string | null) {
      if (!id) return null;

      const { data } = await supabase.rpc('get_user_name', { userid: id});
  
      return data;
    },

    addFavoriteProduct: throttle(async (productId: string) => {
      const uid = await api.getCurrentUserId();

      if (uid) {
        const { error } = await supabase
          .from('favorite_product')
          .insert({ product_id: productId, user_id: uid });
      }
    }, THROTTLE_MS),

    deleteFavoriteProduct: throttle(async (productId: string) => {
      const uid = await api.getCurrentUserId();

      if (uid) {
        const { error } = await supabase
          .from('favorite_product')
          .delete()
          .eq('product_id', productId);
      }
    }, THROTTLE_MS),

    async isProductFavorite(productId: string) {
      const { data } = await supabase
        .from('favorite_product')
        .select()
        .eq('product_id', productId)
        .single();
      
      return !!data;
    },

    async getFavoriteProductIds() {
      const { data } = await supabase
        .from('favorite_product')
        .select();

      return data?.length ? data : null;
    }
  };

  return api;
}