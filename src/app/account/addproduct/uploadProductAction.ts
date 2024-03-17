'use server';

import { getAPI } from "@/supabase/api";
import { createOtherSupabaseClient } from "@/supabase/utils_server";
import { FormSchema } from "./types";
import { z } from "zod";
import { redirect } from "next/navigation";

export default async function uploadProductAction(form: z.infer<typeof FormSchema> | null) {
  const supabase = createOtherSupabaseClient();
  const api = getAPI(supabase);
  const uid = await api.getCurrentUserId();

  if (!uid) throw new Error('Current user not authorized');
  if (!form)
    redirect(`?error=${encodeURIComponent('Форма пустая')}`);
  if (!FormSchema.safeParse(form).success)
    redirect(`?error=${encodeURIComponent('Ошибка валидации формы')}`);

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

  if (addProductError)
    redirect(`?error=${encodeURIComponent('Не удалось загрузить товар')}`);

  return product.id;
}