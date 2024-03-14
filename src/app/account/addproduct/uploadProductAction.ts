'use server';

import type { Form } from "./types";
import { getAPI } from "@/supabase/api";
import { createOtherSupabaseClient } from "@/supabase/utils_server";

export default async function uploadProductAction(form: Form) {
  const supabase = createOtherSupabaseClient();
  const api = getAPI(supabase);
  const uid = await api.getCurrentUserId();

  if (!uid) throw new Error('Current user not authorized');

  const title = form.title;
  const description = form.description;
  const category = form.category;
  const price = Number(form.price);
  const quantity = Number(form.quantity);

  const { data: product, error: addProductError } = await supabase
    .from('product')
    .insert({
      title, description, category, price, quantity, owner: uid
    })
    .select()
    .single();

  if (addProductError) throw new Error(addProductError.message);

  return product.id;
}