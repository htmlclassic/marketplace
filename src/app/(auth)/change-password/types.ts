import { z } from "zod";
import { getPasswordErrorDescription, passwordSchema } from "../types";

export const formSchema =
  z.object({
    old_password: z.string(),
    new_password: z.string().refine(
      value => passwordSchema.validate(value),
      value => ({ message: getPasswordErrorDescription(value) })
    ),
    confirm_new_password: z.string(),
  })
  .refine(formData => formData.new_password === formData.confirm_new_password, {
    message: 'Пароль не совпадает с новым паролем выше',
    path: ['confirm_new_password'],
  });