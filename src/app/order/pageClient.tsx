'use client';

import { useContext } from "react";
import { FormDataZodSchema, Inputs, StrippedCartItem } from "./types";
import buyItems from "./buyItems";
import { CartContext } from "@/src/CartContext";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { AsYouType } from 'libphonenumber-js'
import { numberWithSpaces } from "@/src/utils";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import Error from "./components/Error";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Form, FormField } from "@/src/components/ui/form";
import { Button } from "@/src/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

interface Props {
  uid: string | null;
  marketplaceBalance: number;
}

export default function PageClient({ uid, marketplaceBalance }: Props) {
  const form = useForm<Inputs>({
    resolver: zodResolver(FormDataZodSchema)
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: {
      errors,
      isSubmitting
    }
  } = form;

  const router = useRouter();

  const { cart, clearCart } = useContext(CartContext);

  const totalSumToPay = cart.reduce((acc, cartItem) =>
    acc + cartItem.product.price * cartItem.quantity, 0);
  const marketplaceAllowBuy = marketplaceBalance >= totalSumToPay;
  const paymentType = watch('paymentType') as PaymentType;

  let submitButtonContent: React.ReactNode = 'Перейти к оплате';
  const submitButtonDisabled = isSubmitting || paymentType === 'marketplace' && !marketplaceAllowBuy;

  if (paymentType === 'marketplace' && marketplaceAllowBuy)
    submitButtonContent = `Оплатить ${numberWithSpaces(totalSumToPay)} ₽`;
  if (paymentType === 'marketplace' && !marketplaceAllowBuy)
    submitButtonContent = 'Недостаточно средств';

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const strippedCart: StrippedCartItem[] = cart.map(item => ({
      quantity: item.quantity,
      product: {
        id: item.product.id,
        quantity: item.product.quantity,
        price: item.product.price
      }
    }));

    try {
      const orderId = await buyItems(uid, data, strippedCart);

      sendEmail(orderId, data.receiverName, data.email, data.paymentType as PaymentType);
      
      if (paymentType === 'bank_card') {
        router.push(`/transaction/${orderId}`);
      } else {
        clearCart();

        if (uid) router.push('/account/orders');
        else router.push(`/track-order/${orderId}`);
      }

    } catch (error) {
      console.log(error);
    }
  };

  if (!cart.length) return (
    <div className="side-padding grow flex flex-col pt-10">
      Корзина пуста. Нельзя оплатить товары, которых нет.
    </div>
  );

  return (
    <div
      className="relative grow flex flex-col justify-center items-center"
    >
      <h1 className="mb-5">Оформление заказа</h1>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex gap-5 flex-col p-3 w-[90vw] sm:w-[450px]"
        >
          <Label className="flex flex-col gap-1">
            <Input
              {...register('receiverName', {
                required: true
              })}
              placeholder="Имя получателя"
              disabled={isSubmitting}
              className="py-5"
            />
            <Error error={errors.receiverName} />
          </Label>
          <Label className="flex flex-col gap-1">
            <Input
              {...register('address', {
                required: true
              })}
              placeholder="Адрес"
              disabled={isSubmitting}
              className="py-5"
            />
            <Error error={errors.address} />
          </Label>
          <Label className="flex flex-col gap-1">
            <Input
              {...register('email', {
                required: true
              })}
              placeholder="Электронная почта"
              disabled={isSubmitting}
              className="py-5"
            />
            <Error error={errors.email} />
          </Label>
          <Label className="flex flex-col gap-1">
            <Input
              {...register('phoneNumber', {
                onChange(e: React.ChangeEvent<HTMLInputElement>) {
                  const inputType = ((e.nativeEvent as any).inputType) as string;
                  
                  if (inputType === 'deleteContentBackward') return;

                  e.target.value = new AsYouType('RU').input(e.target.value)
                },
              })}
              placeholder="Номер телефона"
              disabled={isSubmitting}
              className="py-5"
            />
            <Error error={errors.phoneNumber} />
          </Label>

          <FormField
            control={form.control}
            name="paymentType"
            render={({ field }) => (
              <Label className="flex flex-col gap-1">
                <Select
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="py-5">
                    <SelectValue placeholder="Способ оплаты" />
                  </SelectTrigger>
                  <SelectContent
                    {...register('paymentType', {
                      required: true
                    })}
                  >
                    <SelectItem value="bank_card">
                      <div className="flex gap-3 items-center">
                        <CardIcon />
                        Банковская карта
                      </div>
                    </SelectItem>
                    {
                      uid &&
                        <SelectItem value="marketplace">
                          <div className="flex gap-3 items-center">
                            <WalletIcon />
                            Marketplace кошелёк
                          </div>
                        </SelectItem>
                    }
                  </SelectContent>
                </Select>
                <Error error={errors.paymentType} />
              </Label>  
            )}
          />

          <Button 
            disabled={submitButtonDisabled}
            className="py-6"
          >
            {
              isSubmitting
                ? 
                  <ReloadIcon className="w-[20px] h-[20px] animate-spin-fast" />
                :
                  submitButtonContent
            }
          </Button>
          {
            paymentType === 'marketplace' && !marketplaceAllowBuy &&
            <Link 
              href="account/wallet"
              className="text-sm text-gray-400 transition-all hover:underline hover:text-black"
            >
              Пополнить кошелёк
            </Link>
          }
        </form>
      </Form>
    </div>
  );
}

// SEND TRANSACTION LINK TOO
function sendEmail(
  orderId: number,
  receiverName: string,
  receiverEmail: string,
  paymentType: PaymentType
) {
  const trackLink = `https://marketplace-one-hazel.vercel.app/track-order/${orderId}`;
  const transactionLinkURL = `https://marketplace-one-hazel.vercel.app/transaction/${orderId}`;

  const transactionLink = `
    <br><br>
      В случае, если Вы ещё не оплатили заказ, у Вас есть 30 минут для его оплаты.
    <br>
      Оплатить заказ можно здесь: <a href="${transactionLinkURL}">${transactionLinkURL}</a>
  `;

  const params: any = {
    name: receiverName,
    to: receiverEmail,
    orderId,
    trackLink,
  };

  if (paymentType === 'bank_card')
    params.transactionLink = transactionLink;

  const data = {
    service_id: 'service_vndumiu',
    template_id: 'template_dsdlu2x',
    user_id: 'A_WhdlcbVLwO1QzHP',
    template_params: params
  };

  fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });
}

function CardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M22 9.25H2c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h20c.41 0 .75.34.75.75s-.34.75-.75.75zM8 17.25H6c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h2c.41 0 .75.34.75.75s-.34.75-.75.75zM14.5 17.25h-4c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h4c.41 0 .75.34.75.75s-.34.75-.75.75z"
      ></path>
      <path
        fill="currentColor"
        d="M17.56 21.25H6.44c-3.98 0-5.19-1.2-5.19-5.14V7.89c0-3.94 1.21-5.14 5.19-5.14h11.11c3.98 0 5.19 1.2 5.19 5.14v8.21c.01 3.95-1.2 5.15-5.18 5.15zm-11.12-17c-3.14 0-3.69.54-3.69 3.64v8.21c0 3.1.55 3.64 3.69 3.64h11.11c3.14 0 3.69-.54 3.69-3.64V7.89c0-3.1-.55-3.64-3.69-3.64H6.44z"
      ></path>
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M7.17 22.75c-2.38 0-4.33-1.73-4.33-3.86v-2.04c0-.41.34-.75.75-.75s.75.34.75.75c0 1.25 1.21 2.19 2.83 2.19S10 18.1 10 16.85c0-.41.34-.75.75-.75s.75.34.75.75v2.04c0 2.13-1.94 3.86-4.33 3.86zM4.6 19.87c.44.82 1.43 1.38 2.57 1.38s2.13-.57 2.57-1.38c-.71.43-1.59.68-2.57.68-.98 0-1.86-.25-2.57-.68z"
      ></path>
      <path
        fill="currentColor"
        d="M7.17 17.8c-1.64 0-3.11-.75-3.84-1.94-.32-.52-.49-1.13-.49-1.75 0-1.05.46-2.03 1.3-2.76 1.62-1.42 4.41-1.42 6.04-.01.84.74 1.31 1.72 1.31 2.77 0 .62-.17 1.23-.49 1.75-.72 1.19-2.19 1.94-3.83 1.94zm0-6.05c-.78 0-1.5.26-2.04.73-.51.44-.79 1.02-.79 1.63 0 .35.09.67.27.97.46.76 1.44 1.23 2.56 1.23s2.1-.47 2.55-1.22c.18-.29.27-.62.27-.97 0-.61-.28-1.19-.79-1.64-.53-.47-1.25-.73-2.03-.73z"
      ></path>
      <path
        fill="currentColor"
        d="M7.17 20.55c-2.47 0-4.33-1.59-4.33-3.69v-2.75c0-2.13 1.94-3.86 4.33-3.86 1.13 0 2.21.39 3.02 1.09.84.74 1.31 1.72 1.31 2.77v2.75c0 2.1-1.86 3.69-4.33 3.69zm0-8.8c-1.56 0-2.83 1.06-2.83 2.36v2.75c0 1.25 1.21 2.19 2.83 2.19S10 18.11 10 16.86v-2.75c0-.61-.28-1.19-.79-1.64-.54-.46-1.26-.72-2.04-.72zM19.04 14.8c-1.51 0-2.79-1.12-2.91-2.56-.08-.83.22-1.64.82-2.23.5-.52 1.21-.81 1.96-.81H21c.99.03 1.75.81 1.75 1.77v2.06c0 .96-.76 1.74-1.72 1.77h-1.99zm1.93-4.1h-2.05c-.35 0-.67.13-.9.37-.29.28-.43.66-.39 1.04.05.66.69 1.19 1.41 1.19H21c.13 0 .25-.12.25-.27v-2.06c0-.15-.12-.26-.28-.27z"
      ></path>
      <path
        fill="currentColor"
        d="M16 21.25h-2.5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75H16c2.58 0 4.25-1.67 4.25-4.25v-.7h-1.21c-1.51 0-2.79-1.12-2.91-2.56-.08-.83.22-1.64.82-2.23.5-.52 1.21-.81 1.96-.81h1.33v-.7c0-2.34-1.37-3.95-3.59-4.21-.24-.04-.45-.04-.66-.04h-9c-.24 0-.47.02-.7.05-2.2.28-3.55 1.88-3.55 4.2v2c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-2c0-3.08 1.9-5.31 4.85-5.68.27-.04.58-.07.9-.07h9c.24 0 .55.01.87.06 2.95.34 4.88 2.58 4.88 5.69v1.45c0 .41-.34.75-.75.75h-2.08c-.35 0-.67.13-.9.37-.29.28-.43.66-.39 1.04.05.66.69 1.19 1.41 1.19H21c.41 0 .75.34.75.75v1.45c0 3.44-2.31 5.75-5.75 5.75z"
      ></path>
    </svg>
  );
}