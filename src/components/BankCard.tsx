'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import cardValidator from "card-validator";
import clsx from "clsx";
import creditCardType from "credit-card-type";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { numberWithSpaces } from "../utils";
import { Button } from "./ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface Props {
  onSubmit: (formData: Inputs) => Promise<any>;
  sumToPay: number;
}

export default function BankCard({ onSubmit, sumToPay }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataZodSchema),
    mode: 'onChange'
  });
  const cardNumber = watch('number');
  const possibleCardTypes = creditCardType(cardNumber);
  const cardInfo = possibleCardTypes.length === 1 ? possibleCardTypes[0] : null;

  const cardNumberMaxLength = cardInfo?.type === 'mastercard'
    ? MASTERCARD_MAX_LENGTH + 3 : VISA_OR_MIR_MAX_LENGTH + 4; // +3 and +4 are just spaces
  const cardType = cardInfo?.type as CardType | undefined;
  let cardTypeIcon: React.ReactNode | null = null;

  if (cardType === 'mastercard') cardTypeIcon = <MastercardIcon />;
  if (cardType === 'visa') cardTypeIcon = <VisaIcon />;
  if (cardType === 'mir') cardTypeIcon = <MirIcon />;

  const action: SubmitHandler<Inputs> = async (data) => {
    await onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(action)} 
      className="border py-6 px-3 sm:px-6 flex flex-col gap-3 w-full max-w-[420px] rounded-md"
    >
      <header className="mb-5 flex gap-5 items-center">
        <BankCardIcon />
        <div>
          <h1 className="font-medium">Банковская карта</h1>
          <p className="text-gray-500">МИР, Mastercard, Visa</p>
        </div>
      </header>
      <Label className="flex flex-col gap-1">
        Номер карты
        <div className="relative">
          <Input
            {...register('number', {
              onChange(e: React.ChangeEvent<HTMLInputElement>) {
                let value = e.target.value;

                value = lastCharIsDigit(value);

                e.target.value = splitStringByGroups(value, 4);
              },
            })}
            maxLength={cardNumberMaxLength}
            className="py-5"
            disabled={isSubmitting}
          />
          <div className={clsx({
            "absolute right-3 top-1/2 -translate-y-1/2": true,
            "opacity-30": isSubmitting
          })}>{cardTypeIcon}</div>
        </div>
        {
          errors.number?.message &&
          <div className="text-sm text-red-400">{errors.number.message}</div>
        }
      </Label>
      <div className="flex gap-3">
        <Label className="flex flex-col gap-1 w-full">
          Срок действия
          <Input
            {...register('exp', {
              onChange(e: React.ChangeEvent<HTMLInputElement>) {
                let value = e.target.value;
                const inputType = ((e.nativeEvent as any).inputType) as string;
                
                value = lastCharIsDigit(value);
                e.target.value = value;

                if (value.length === 2) {
                  value = value + '/';

                  e.target.value = value;
                }

                if (value.length === 3 && value.at(-1) !== '/') {
                  value = value[0] + value[1] + '/' + value[2];

                  e.target.value = value;
                }

                if (value.length === 3 && inputType === 'deleteContentBackward') {
                  e.target.value = value.slice(0, 2);
                }
              }
            })}
            className="py-5"
            disabled={isSubmitting}
          />
          {
            errors.exp?.message &&
            <div className="text-sm text-red-400">{errors.exp.message}</div>
          }
        </Label>
        <Label className="flex flex-col gap-1 w-full">
          CVC/CVV
          <Input
            {...register('securityCode', {
              onChange(e: React.ChangeEvent<HTMLInputElement>) {
                let value = e.target.value;

                value = lastCharIsDigit(value);
                e.target.value = value;
              }
            })}
            className="py-5"
            disabled={isSubmitting}
          />
          {
            errors.securityCode?.message &&
            <div className="text-sm text-red-400">{errors.securityCode.message}</div>
          }
        </Label>
      </div>
      <Button
        disabled={isSubmitting}
        className="mt-5 py-6 flex gap-1"
      >
        {
          isSubmitting ?
            <ReloadIcon className="animate-spin-fast w-[20px] h-[20px]" />
          :  
            <>
              <span>Оплатить </span>
              <span>{ sumToPay && numberWithSpaces(sumToPay) + ' ₽' }</span>
            </>
        }
      </Button>
    </form>
  )
}

export interface Inputs {
  number: string;
  exp: string;
  securityCode: string;
}

export const FormDataZodSchema = z.object({
  number: z.string().refine(number => {
    if (cardValidator.number(number).isValid) return true;
  }, { message: 'Проверьте номер карты' }),

  exp: z.string().refine(exp => {
    if (cardValidator.expirationDate(exp).isValid) return true;
  }, { message: 'Проверьте срок действия' }),

  securityCode: z.string()
    .refine(cvv => {
      if (cardValidator.cvv(cvv).isValid) return true;
    }, { message: 'Проверьте CVC/CVV' })
});

type CardType = 'mir' | 'mastercard' | 'visa';

const MASTERCARD_MAX_LENGTH = 16;
const VISA_OR_MIR_MAX_LENGTH = 19;
const ICON_SIZE = 30;

// checks last char of a string if its a digit
// on false returns string (length-1)
// on true returns the same string
function lastCharIsDigit(str: string) {
  return !parseInt(str.at(-1)!) && str.at(-1) !== '0' ? str.slice(0, -1) : str;
}

function splitStringByGroups(str: string, groupLength: number, separatorChar: string = ' ') {
  const strWithNoSpaces = str.replace(/ /g, '');
  const arr = strWithNoSpaces.match(new RegExp('.{1,' + groupLength + '}', 'g'));
  
  return arr ? arr.join(separatorChar) : str;
}

function BankCardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={25} height={25}>
      <g>
        <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
          <g fillRule="nonzero" transform="translate(-48 -48)">
            <g transform="translate(48 48)">
              <path
                fillRule="nonzero"
                d="M24 0v24H0V0h24zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018zm.265-.113l-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092z"
              ></path>
              <path
                fill="#000"
                d="M22 10v7a3 3 0 01-3 3H5a3 3 0 01-3-3v-7h20zm-4 4h-3a1 1 0 100 2h3a1 1 0 100-2zm1-10a3 3 0 013 3v1H2V7a3 3 0 013-3h14z"
              ></path>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

function MirIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={ICON_SIZE}
      height={ICON_SIZE}
      fill="none"
      viewBox="0 0 512 512"
    >
      <path
        fill="#0F754E"
        fillRule="evenodd"
        d="M47.346 186.024c4.574-.028 18.169-1.252 23.927 18.182 3.879 13.091 10.057 34.534 18.536 64.331h3.453c9.092-31.414 15.338-52.857 18.738-64.331 5.818-19.636 20.364-18.182 26.182-18.182h44.888V325.66h-45.751v-82.29h-3.068l-25.505 82.29H74.324L48.82 243.309h-3.068v82.351H0V186.024h47.346zm201.423 0v82.351h3.65l31.024-67.716c6.022-13.476 18.857-14.635 18.857-14.635h44.274v139.637h-46.707v-82.352h-3.65l-30.415 67.717c-6.023 13.415-19.466 14.635-19.466 14.635h-44.274V186.024h46.707zm259.246 66.356c-6.515 18.463-26.975 31.685-49.627 31.685h-48.982v41.596H364.99V252.38h143.025z"
        clipRule="evenodd"
      ></path>
      <path
        fill="url(#paint0_linear_108_254)"
        fillRule="evenodd"
        d="M460.53 186.024h-97.869c2.329 31.088 29.101 57.701 56.815 57.701h91.625c5.288-25.837-12.914-57.701-50.571-57.701z"
        clipRule="evenodd"
      ></path>
      <defs>
        <linearGradient
          id="paint0_linear_108_254"
          x1="512"
          x2="362.661"
          y1="222.321"
          y2="222.321"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1F5CD7"></stop>
          <stop offset="1" stopColor="#02AEFF"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
}

function VisaIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={ICON_SIZE}
      height={ICON_SIZE}
      fill="none"
      viewBox="0 0 512 512"
    >
      <path
        fill="#1434CB"
        d="M253.509 175.921L219.303 335.84h-41.374l34.209-159.919h41.371zm174.059 103.261l21.775-60.052 12.531 60.052h-34.306zm46.176 56.658H512l-33.422-159.919H443.29c-7.953 0-14.658 4.611-17.625 11.722L363.587 335.84h43.45l8.625-23.883h53.072l5.01 23.883zm-108.002-52.208c.179-42.206-58.345-44.544-57.953-63.402.126-5.73 5.593-11.833 17.542-13.394 5.924-.763 22.272-1.382 40.803 7.157l7.247-33.925c-9.952-3.601-22.761-7.068-38.698-7.068-40.9 0-69.671 21.725-69.901 52.859-.263 23.024 20.552 35.861 36.202 43.529 16.135 7.838 21.541 12.863 21.462 19.866-.111 10.729-12.866 15.48-24.742 15.66-20.812.324-32.876-5.625-42.49-10.107l-7.51 35.059c9.683 4.431 27.523 8.287 45.996 8.485 43.483 0 71.912-21.47 72.042-54.719zM194.391 175.921L127.357 335.84H83.63L50.64 208.213c-2-7.848-3.744-10.733-9.827-14.049-9.949-5.403-26.372-10.456-40.813-13.6l.978-4.643h70.398c8.967 0 17.034 5.967 19.088 16.297l17.427 92.547 43.036-108.844h43.464z"
      ></path>
    </svg>
  );
}

function MastercardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={ICON_SIZE}
      height={ICON_SIZE}
      fill="none"
      viewBox="0 0 512 512"
    >
      <path
        fill="#231F20"
        d="M93.14 453.003v-26.368a15.636 15.636 0 00-16.523-16.699 16.273 16.273 0 00-14.766 7.471 15.425 15.425 0 00-13.886-7.471 13.903 13.903 0 00-12.305 6.24v-5.185h-9.141v42.012h9.228v-23.292a9.823 9.823 0 016.041-10.457 9.833 9.833 0 014.243-.705c6.064 0 9.14 3.956 9.14 11.074v23.38h9.23v-23.292a9.908 9.908 0 0110.282-11.162c6.24 0 9.228 3.956 9.228 11.074v23.38h9.229zm136.582-42.012h-14.941v-12.744h-9.229v12.744h-8.525v8.35h8.525v19.16c0 9.755 3.78 15.557 14.59 15.557a21.465 21.465 0 0011.426-3.253l-2.637-7.822a16.87 16.87 0 01-8.086 2.373c-4.57 0-6.064-2.813-6.064-7.031v-18.984h14.941v-8.35zm77.959-1.055a12.396 12.396 0 00-11.074 6.153v-5.098h-9.053v42.012h9.141v-23.555c0-6.943 2.988-10.811 8.965-10.811a14.915 14.915 0 015.713 1.055l2.812-8.613a19.539 19.539 0 00-6.504-1.143zm-117.861 4.395a31.416 31.416 0 00-17.139-4.395c-10.635 0-17.49 5.098-17.49 13.447 0 6.856 5.098 11.075 14.501 12.393l4.307.615c5.01.702 7.383 2.021 7.383 4.394 0 3.252-3.34 5.099-9.58 5.099a22.381 22.381 0 01-13.975-4.396l-4.306 7.12a30.318 30.318 0 0018.193 5.45c12.129 0 19.16-5.714 19.16-13.712 0-7.383-5.537-11.25-14.677-12.569l-4.306-.615c-3.956-.527-7.12-1.317-7.12-4.13 0-3.076 2.988-4.922 7.998-4.922 4.6.069 9.107 1.31 13.096 3.603l3.955-7.382zm244.863-4.395a12.396 12.396 0 00-11.074 6.153v-5.098h-9.053v42.012h9.14v-23.555c0-6.943 2.989-10.811 8.965-10.811a14.9 14.9 0 015.714 1.055l2.812-8.613a19.539 19.539 0 00-6.504-1.143zm-117.774 22.06a21.233 21.233 0 006.318 15.997 21.234 21.234 0 0016.095 6.065 22.01 22.01 0 0015.117-5.011l-4.395-7.383a18.467 18.467 0 01-10.986 3.78 13.473 13.473 0 010-26.895 18.467 18.467 0 0110.986 3.78l4.395-7.383a22.014 22.014 0 00-15.117-5.01A21.237 21.237 0 00323.228 416a21.223 21.223 0 00-6.319 15.996zm85.606 0v-21.005h-9.141v5.098a15.928 15.928 0 00-13.271-6.153 22.086 22.086 0 00-14.914 37.292 22.086 22.086 0 0014.914 6.83 15.94 15.94 0 0013.271-6.154v5.099h9.141v-21.007zm-34.014 0a12.72 12.72 0 1112.745 13.448 12.61 12.61 0 01-9.318-3.933 12.605 12.605 0 01-3.427-9.515zm-110.302-22.06c-5.7.3-11.063 2.796-14.962 6.965a22.076 22.076 0 0015.577 37.157 25.537 25.537 0 0017.227-5.89l-4.483-6.767a20.008 20.008 0 01-12.217 4.394 11.67 11.67 0 01-8.367-2.596 11.674 11.674 0 01-4.201-7.687h31.201c.088-1.142.176-2.285.176-3.516-.088-13.095-8.174-22.06-19.951-22.06zm-.176 8.174a10.434 10.434 0 0110.635 10.195h-21.797a10.813 10.813 0 0111.162-10.195zm229.306 13.886v-37.88h-9.14v21.973a15.94 15.94 0 00-13.272-6.153 22.086 22.086 0 00-14.914 37.292 22.086 22.086 0 0014.914 6.83 15.953 15.953 0 007.384-1.464 15.957 15.957 0 005.888-4.69v5.099h9.14v-21.007zm15.237 14.918a4.191 4.191 0 011.654.328 4.221 4.221 0 012.261 2.226 4.102 4.102 0 010 3.24 4.252 4.252 0 01-2.261 2.225 4.137 4.137 0 01-1.654.333 4.26 4.26 0 01-3.945-2.558 4.123 4.123 0 010-3.24 4.176 4.176 0 012.263-2.226 4.313 4.313 0 011.682-.328zm0 7.431c.434.003.863-.084 1.26-.256a3.314 3.314 0 001.023-.696 3.273 3.273 0 000-4.606 3.229 3.229 0 00-1.023-.69 3.133 3.133 0 00-1.26-.251 3.273 3.273 0 00-2.322.941 3.27 3.27 0 000 4.606 3.283 3.283 0 002.322.952zm.246-5.21c.411-.027.819.091 1.152.333a1.107 1.107 0 01.404.906 1.054 1.054 0 01-.322.792 1.538 1.538 0 01-.916.384l1.269 1.464h-.993l-1.177-1.454h-.378v1.454h-.829v-3.879h1.79zm-.961.727v1.034h.951a.94.94 0 00.523-.129.432.432 0 00.193-.393.426.426 0 00-.193-.385.947.947 0 00-.523-.127h-.951zm-48.535-17.866a12.717 12.717 0 018.33-11.219 12.722 12.722 0 0116.064 16.951 12.722 12.722 0 01-11.65 7.716 12.61 12.61 0 01-9.318-3.933 12.603 12.603 0 01-3.426-9.515zm-308.672 0v-21.005h-9.141v5.098a15.928 15.928 0 00-13.271-6.153 22.09 22.09 0 00-21.006 22.061 22.089 22.089 0 0021.006 22.061 15.94 15.94 0 0013.271-6.154v5.099h9.141v-21.007zm-34.013 0a12.724 12.724 0 018.33-11.219 12.718 12.718 0 0116.891 9.706 12.72 12.72 0 01-12.478 14.961 12.609 12.609 0 01-9.317-3.933 12.592 12.592 0 01-3.426-9.515z"
      ></path>
      <path
        fill="#FF5F00"
        d="M325.228 90.82H186.781v248.792h138.447V90.82z"
      ></path>
      <path
        fill="#EB001B"
        d="M195.571 215.225a157.948 157.948 0 0160.432-124.396 158.224 158.224 0 100 248.792 157.951 157.951 0 01-60.432-124.396z"
      ></path>
      <path
        fill="#F79E1B"
        d="M512 215.225a158.223 158.223 0 01-89.067 142.313 158.218 158.218 0 01-166.928-17.917 158.247 158.247 0 000-248.792 158.22 158.22 0 01231.894 40.451A158.226 158.226 0 01512 215.225zM496.905 313.265v-5.094h2.054v-1.037h-5.23v1.037h2.054v5.094h1.122zm10.155 0v-6.141h-1.603l-1.844 4.224-1.845-4.224h-1.604v6.141h1.132v-4.633l1.73 3.994h1.173l1.73-4.004v4.643h1.131z"
      ></path>
    </svg>
  );
}