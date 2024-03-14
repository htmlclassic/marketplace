import PasswordValidator from "password-validator";
import { z } from "zod";

const passwordSchema = new PasswordValidator();

passwordSchema
  .is().min(6)           // Minimum length 8
  .is().max(30)          // Maximum length 100
  .has().uppercase()     // Must have uppercase letters
  .has().lowercase()     // Must have lowercase letters
  .has().digits(1)       // Must have at least 2 digits
  .has().symbols(1)      // Must have at least 1 symbol
  .has().not().spaces(); // Should not have spaces

type PasswordSchemaError = 
  'min' | 'max' | 'uppercase' | 'lowercase' | 'digits' | 'spaces' | 'symbols';
type PasswordSchemaErrorList = PasswordSchemaError[];

function getErrorDescription(value: string) {
  // if length === 0, no errors present
  const errorList = passwordSchema.validate(value, { list: true }) as PasswordSchemaErrorList;

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

export const formSchema =
  z.object({
    old_password: z.string(),
    new_password: z.string().refine(
      value => passwordSchema.validate(value),
      value => ({ message: getErrorDescription(value) })
    ),
    confirm_new_password: z.string(),
  })
  .refine(formData => formData.new_password === formData.confirm_new_password, {
    message: 'Пароль не совпадает с новым паролем выше',
    path: ['confirm_new_password'],
  });