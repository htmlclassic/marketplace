import { z } from "zod";

const INT2_MAX = 32_767;
const INT4_MAX = 2_147_483_647;

export const FormSchema = z.object({
  title: z.string().trim()
    .min(10, { message: 'Наименование не должно быть короче 10 символов' })
    .max(200, { message: 'Наименование не должно превышать 200 символов' }),
  description: z.string().trim()
    .min(50, { message: 'Описание не должно быть короче 50 символов' })
    .max(10_000, { message: 'Описание не должно превышать 10 000 символов' }),
  category: z.string({ errorMap() {
    return { message: 'Выберите категорию' };
  } }),
  price: z.number({ errorMap() {
    return { message: 'Цена указывается в числах' }
  } })
    .min(1, { message: 'Цена не должна быть меньше 1' })
    .max(INT4_MAX, { message: `Цена не должна быть больше ${INT4_MAX}` }),
  quantity: z.number({ errorMap() {
    return { message: 'Количество указывается в числах' };
  } })
    .min(1, { message: 'Количество не должно быть меньше 1' })
    .max(INT2_MAX, { message: `Количество не должно превышать ${INT2_MAX}` })
});