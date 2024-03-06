import { isValidPhoneNumber } from "libphonenumber-js";
import { ZodType, z } from "zod";

export enum Errors {
  EMPTY_ADDRESS = 'Address is empty',
  EMPTY_CART = 'Cart is empty',
  LOW_BALANCE = 'Balance is less than total products\' price',
  PRODUCTS_QUANTITY_CHANGED = 'There are more items in the cart than in the database',
  PRODUCTS_DONT_EXIST = 'Some of the products in the cart were deleted',
  CREATE_ORDER_ERROR = 'Couldn\'t create an order'
};

export type StrippedCartItem = Omit<CartItem, 'product'> &
  { product: Pick<Product, 'id' | 'quantity' | 'price'> };

export interface Inputs {
  paymentType: string;
  address: string;
  email: string;
  receiverName: string;
  phoneNumber: string;
}

export const FormDataZodSchema = z.object({
  paymentType: z.enum(['bank_card', 'marketplace'], {
    errorMap: () => ({ message: 'Выберите способ оплаты' })
  }),

  address: z.string()
    .min(1, { message: 'Адрес должен содержать хотя бы один символ' })
    .max(300, { message: 'Длина адреса не должна превышать 300 символов' }),

  email: z.string().email({ message: 'Неверная почта' }),

  receiverName: z.string()
    .min(2, { message: 'Длина имени не должна быть меньше 2 символов' })
    .max(30, { message: 'Длина имени не должна превышать 30 символов' }),

  phoneNumber: z.string().refine(phoneNumber => {
    let formattedNumber = phoneNumber;

    // idk why, but isValidPhoneNumber() returns true for number like '8 (921) 622-25-1'
    // if number starts with +7 everything works fine
    if (formattedNumber[0] === '8') {
      formattedNumber = '+7' + formattedNumber.slice(1);
    }

    return isValidPhoneNumber(formattedNumber, 'RU');
  }, {
    message: 'Неверный номер телефона'
  })
});

export type PaymentType = 'bank_card' | 'marketplace';

export type FormDataType = z.infer<typeof FormDataZodSchema>;