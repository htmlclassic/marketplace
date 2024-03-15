'use client';

import SubmitButton from "../components/SubmitButton";
import { signUp } from "../actions";
import Messages from "../messages";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import clsx from "clsx";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import InputPassword from "@/src/components/InputPassword";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signupFormSchema } from "../types";
import { Button } from "@/src/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting
    },
  } = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema)
  });

  const onSubmit: SubmitHandler<z.infer<typeof signupFormSchema>> = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 5000));
  };

  return (
    <Card className="w-full max-w-[400px] overflow-hidden relative shadow-none border-none sm:shadow-[0_0_5px_1px_rgba(0,0,0,0.1)] sm:border">
      <CardHeader className="pb-0">
        <CardTitle className="text-center text-lg">Регистрация</CardTitle>
      </CardHeader>
      <CardContent className={clsx({
        "relative p-0 pt-0 transition-all duration-300": true,
      })}>
        <form
            className="flex flex-col w-full justify-center gap-3 bg-white p-7 rounded-lg"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                {...register('name')}
                disabled={isSubmitting}
                id="name"
                className="py-5"
              />
              <div className="text-xs text-red-400">{errors.name?.message}</div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Почта</Label>
              <Input
                {...register('email')}
                disabled={isSubmitting}
                id="email"
                className="py-5"
              />
              <div className="text-xs text-red-400">{errors.email?.message}</div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Пароль</Label>
              <InputPassword
                {...register('password')}
                disabled={isSubmitting}
                id="password"
                className="py-5"
              />
              <div className="text-xs text-red-400">{errors.password?.message}</div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm_password">Повторите пароль</Label>
              <InputPassword
                {...register('confirm_password')}
                disabled={isSubmitting}
                id="confirm_password"
                className="py-5"
              />
              <div className="text-xs text-red-400">{errors.confirm_password?.message}</div>
            </div>
            <Button
              variant='default'
              className="relative py-6 px-3 mt-3"
              disabled={isSubmitting}
            >
              <div className="absolute left-3 top-1/2 -translate-y-1/2">  
                {
                  isSubmitting &&
                    <ReloadIcon className="w-[20px] h-[20px] animate-spin-fast" />
                }
              </div>
              <span className="ml-3 text-base">Зарегистрироваться</span>
            </Button>
            <Messages />
          </form>
      </CardContent>
    </Card>
  );
}