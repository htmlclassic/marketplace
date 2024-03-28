'use server';

import { getAPI } from "@/supabase/api";
import { createServerComponentSupabaseClient } from "@/supabase/utils_server";

export async function createReview(product_id: string, formData: FormData) {
  const supabase = createServerComponentSupabaseClient();
  const api = getAPI(supabase);
  const uid = await api.getCurrentUserId();

  if (!uid) throw new Error('Who is it?');

  const { data: product } = await supabase
    .from('order_items')
    .select('order(user_id)')
    .eq('product_id', product_id)
    .limit(1)
    .single();

  const userBoughtProduct = Boolean(product?.order?.user_id);
  
  if (!userBoughtProduct) throw new Error('You cant review a product you havent bought')

  const { data } = await supabase
    .from('review')
    .select('id')
    .match({
      author_id: uid,
      product_id
    })
    .limit(1)
    .single();
  
  if (data) throw new Error('Cant create second review on the same product');

  const pros = String(formData.get('pros'));
  const cons = String(formData.get('cons'));
  const comment = String(formData.get('comment'));
  const rating = Number(formData.get('rating'));

  if (rating < 1 || rating > 5) throw new Error('Rating must be 1-5');

  const { error } = await supabase
    .from('review')
    .insert({
      product_id,
      author_id: uid,
      pros,
      cons,
      comment,
      rating,
    });

  if (error) throw new Error(error.message);
}