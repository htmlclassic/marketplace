import PasswordValidator from "password-validator";
import { z } from "zod";

const passSchema = new PasswordValidator();

passSchema
  .is().min(6)           // Minimum length 8
  .is().max(30)          // Maximum length 30
  .has().uppercase()     // Must have uppercase letters
  .has().lowercase()     // Must have lowercase letters
  .has().digits(1)       // Must have at least 1 digit
  .has().symbols(1)      // Must have at least 1 symbol
  .has().not().spaces(); // Should not have spaces

export const passwordSchema = passSchema;

type PasswordSchemaError = 
  'min' | 'max' | 'uppercase' | 'lowercase' | 'digits' | 'spaces' | 'symbols';
type PasswordSchemaErrorList = PasswordSchemaError[];

export function getPasswordErrorDescription(value: string) {
  // if length === 0, no errors present
  const errorList = passSchema.validate(value, { list: true }) as PasswordSchemaErrorList;

  if (errorList.length === 0) return '';

  switch(errorList[0]) {
    case 'digits':
      return 'Пароль должен содержать хотя бы одну цифру'
    case 'lowercase':
      return 'Пароль должен содержать хотя бы одну букву в нижнем регистре'
    case 'uppercase':
      return 'Пароль должен содержать хотя бы одну букву в верхнем регистре'
    case 'max':
      return 'Пароль должен содержать не больше 30 символов'
    case 'min':
      return 'Пароль должен содержать не меньше 6 символов'
    case 'spaces':
      return 'Пароль не должен содержать пробелов'
    case 'symbols':
      return 'Пароль должен содержать хотя бы один специальный символ'
  }
}

export const signupFormSchema =
  z.object({
    name: z.string().trim()
      .min(2, {
        message: 'Имя должно содержать как минимум 2 символа'
      })
      .max(30, {
        message: 'Имя не должно быть длиннее 30 символов'
      }),
    email: z.string().email({ message: 'Неправильная почта' }),
    password: z.string().refine(
      value => passwordSchema.validate(value),
      value => ({ message: getPasswordErrorDescription(value) })
    ),
    confirm_password: z.string(),
  })
  .refine(formData => formData.password === formData.confirm_password, {
    message: 'Пароль не совпадает с паролем выше',
    path: ['confirm_password'],
});