'use client';

import InputPassword from "@/src/components/InputPassword";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import clsx from "clsx";
import { signIn } from "../../actions";
import Messages from "../../messages";
import SubmitButton from "../../components/SubmitButton";
import { useState } from "react";
import { EnterIcon } from "@radix-ui/react-icons";

export default function SubmitWithEmailForm({ show }: { show: boolean }) {
  const [disabled, setDisabled] = useState(false);

  return (
    <form action={signIn} className={clsx({
      "py-10 transition-all duration-300 absolute top-0 left-0 w-full h-full p-6 pt-0 flex flex-col gap-3": true,
      "translate-x-[120%] pointer-events-none": !show,
      "translate-x-0 pointer-events-auto": show
    })}>
      <Label htmlFor="email">Почта</Label>
      <Input id="email" className="shrink-0 py-5" name="email"  disabled={disabled} />
      <Label htmlFor="password">Пароль</Label>
      <InputPassword id="password" className="shrink-0 py-5" name="password"  disabled={disabled} />
      <SubmitButton
        isSubmitting={(value) => setDisabled(value)}
        icon={<EnterIcon className="w-[20px] h-[20px]" />}
      >Вход</SubmitButton>
      <Messages />
    </form>
  );
}