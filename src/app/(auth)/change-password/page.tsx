'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/src/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons"
import { changePassword } from "./action";
import { formSchema } from "./types";
import { useEffect, useState } from "react";
import clsx from "clsx";
import InputPassword from "@/src/components/InputPassword";

interface AfterSubmitMessage {
  success: boolean;
  message: string;
}

const afterSubmitMessageInitial: AfterSubmitMessage = { success: true, message: '' };

export default function Page() {
  const [afterSubmitMessage, setAfterSubmitMessage] = useState(afterSubmitMessageInitial);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_new_password: ''
    },
  })

  const submitting = form.formState.isSubmitting;
  const isDirty = form.formState.isDirty;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const submitSuccess = await changePassword(values);

    if (submitSuccess) {
      setAfterSubmitMessage({
        success: true,
        message: 'Пароль успешно изменен'
      });
    } else {
      setAfterSubmitMessage({
        success: false,
        message: 'Ошибка при изменении пароля'
      });
    }
  }

  useEffect(() => {
    form.reset()
  }, [form.formState.isSubmitSuccessful])

  useEffect(() => {
    if (isDirty && afterSubmitMessage) {
      setAfterSubmitMessage(afterSubmitMessageInitial);
    }
  }, [isDirty]);

  return (
    <Card className="w-full max-w-[400px]">
      <CardHeader>
        <CardTitle>Изменение пароля</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              disabled={submitting}
              control={form.control}
              name="old_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Текущий пароль</FormLabel>
                  <FormControl>
                    <InputPassword
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={submitting}
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Новый пароль</FormLabel>
                  <FormControl>
                    <InputPassword
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={submitting}
              control={form.control}
              name="confirm_new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Повторите новый пароль</FormLabel>
                  <FormControl>
                    <InputPassword
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={submitting}
            >
              { submitting && <ReloadIcon className="mr-2 h-4 w-4 animate-spin-fast" /> }
              Изменить пароль
            </Button>
            {
              afterSubmitMessage.message &&
                <p className={clsx({
                  "text-sm": true,
                  "text-red-400": !afterSubmitMessage.success
                })}>
                  {afterSubmitMessage.message}
                </p>
            }
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}