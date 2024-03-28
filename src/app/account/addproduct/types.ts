import { z } from "zod";

const INT2_MAX = 32_767;
const INT4_MAX = 2_147_483_647;

const TITLE_MIN_LENGTH = 10;
const TITLE_MAX_LENGTH = 200;

const DESCRIPTION_MIN_LENGTH = 50;
const DESCRIPTION_MAX_LENGTH = 10_000;

export const FormSchema = z.object({
  title: z.string().trim()
    .min(
      TITLE_MIN_LENGTH, 
      { message: `Наименование не должно быть короче ${TITLE_MIN_LENGTH} символов` }
    )
    .max(
      TITLE_MAX_LENGTH, 
      { message: `Наименование не должно превышать ${TITLE_MAX_LENGTH} символов` }
    ),

  description: z.string().trim()
    .min(
      DESCRIPTION_MIN_LENGTH, 
      { message: `Описание не должно быть короче ${DESCRIPTION_MIN_LENGTH} символов` }
    )
    .max(
      DESCRIPTION_MAX_LENGTH, 
      { message: `Описание не должно превышать ${DESCRIPTION_MAX_LENGTH} символов` }
    ),

  category: z.string({ errorMap() { return { message: 'Выберите категорию' } }}),

  price:
    z.number({ errorMap() { return { message: 'Укажите цену в числах' } }})
    .min(1, { message: 'Цена не должна быть меньше 1' })
    .max(INT4_MAX, { message: `Цена не должна быть больше ${INT4_MAX}` }),

  quantity: 
    z.number({ errorMap() { return { message: 'Укажите количество в числах' } }})
    .min(1, { message: 'Количество не должно быть меньше 1' })
    .max(INT2_MAX, { message: `Количество не должно превышать ${INT2_MAX}` }),
  
  size_x:
    z.number({ errorMap() { return { message: 'Укажите длину в числах' } }}),
  size_y:
    z.number({ errorMap() { return { message: 'Укажите ширину в числах' } }}),
  size_z:
    z.number({ errorMap() { return { message: 'Укажите высоту (толщину) в числах' } }}),
  weight:
    z.number({ errorMap() { return { message: 'Укажите вес в числах' } }}),

  custom_characterstics: z.array(
    z.object({
      key: z.string(),
      value: z.string()
    })
  ),
});

export type FormState = z.infer<typeof FormSchema>;