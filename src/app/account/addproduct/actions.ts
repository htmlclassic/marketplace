'use server';

import { getAPI } from "@/supabase/api";
import { createOtherSupabaseClient } from "@/supabase/utils_server";
import { FormSchema, FormState } from "./types";
import { removeEmptyCustomCharacteristics } from "./utils";

export default async function uploadProductAction(form: FormState | null) {
  const supabase = createOtherSupabaseClient();
  const api = getAPI(supabase);
  const uid = await api.getCurrentUserId();

  if (!uid) throw new Error('Пользователь не авторизован');
  if (!form) throw new Error('Форма пустая');
  if (!FormSchema.safeParse(form).success) throw new Error('Ошибка валидации формы');

  const type = form.type;
  const title = form.title;
  const description = form.description;
  const category = form.category;
  const price = form.price;
  const quantity = form.quantity;
  const weight = form.weight;
  const size = `${form.size_x}x${form.size_y}x${form.size_z}`;
  const customCharacteristics = removeEmptyCustomCharacteristics(form.custom_characterstics);

  const { data: product, error: addProductError } = await supabase
    .from('product')
    .insert({
      type, title: `${type} ${title}`, description, category, price, quantity, owner: uid
    })
    .select()
    .single();

  if (addProductError) throw new Error('Не удалось добавить товар');

  const { error: addDefaultCharacteristicsError } = await supabase
    .from('product_characteristic')
    .insert([
      { name: 'Размеры (мм)', value: size, product_id: product.id },
      { name: 'Вес (г)', value: weight.toString(), product_id: product.id }
    ]);
  
  if (addDefaultCharacteristicsError)
    throw new Error('Не удалось добавить стандартные характеристики товара');

  if (customCharacteristics.length) {
    const customCharacteristicsFormatted = customCharacteristics.map(char => ({
      name: char.key,
      value: char.value,
      product_id: product.id
    }))

    const { error: addCustomCharacteristicsError } = await supabase
      .from('product_characteristic')
      .insert(customCharacteristicsFormatted);

    if (addCustomCharacteristicsError)
    throw new Error('Не удалось добавить пользовательские характеристики товара');
  }

  return product.id;
}