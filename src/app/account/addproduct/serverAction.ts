'use server';

import { getAPI } from "@/supabase/api";
import { createOtherSupabaseClient } from "@/supabase/utils_server";

export async function addProduct(formData: FormData) {
  const supabase = createOtherSupabaseClient();
  const api = getAPI(supabase);
  const uid = await api.getCurrentUserId();

  if (!uid) throw new Error('Current user not authorized');

  const title = String(formData.get('title'));
  const description = String(formData.get('description'));
  const category = String(formData.get('category'));
  const price = Number(formData.get('price'));
  const quantity = Number(formData.get('quantity'));
  // const files = formData.getAll('files');

  const { data: product, error: addProductError } = await supabase
    .from('product')
    .insert({
      title, description, category, price, quantity, owner: uid
    })
    .select()
    .single();

  if (addProductError) throw new Error(addProductError.message);

  return product.id;
  
  // validate total size (4.5mb max because of vercel limitations)
  // on each iteration check mime type first
  // for (const file of files) {
  //   if (typeof file !== 'string') {
  //     // supabase doesn't like russian letters in img name, only english. throws an error. any way to solve it?
  //     const randomFileName = Math.random().toString().split('.')[1] + file.name.split('.')[1];
  //     const { error } = await supabase.storage.from('images').upload(`${productId}/${randomFileName}`, file);
      
  //     if (error) console.warn('Couldnt add one of your images: ' + error.message);
  //   }
  // }
}