'use client';

import { InputProps, Input } from "@/src/components/ui/input";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { forwardRef, useState } from "react";

const InputPassword = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const BUTTON_WIDTH = 35;

  const handleClick = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="relative rounded-md">
      <Input
        ref={ref}
        type={passwordVisible ? 'text' : 'password'}
        {...props}
        style={{
          paddingRight: `calc(${BUTTON_WIDTH}px + 0.75rem)`,
        }}
      />
      <div
        onClick={handleClick}
        style={{ width: BUTTON_WIDTH }}
        className="absolute h-full top-0 right-0 flex items-center justify-center transition-all hover:bg-gray-100 cursor-pointer"
      >
        { passwordVisible ? <EyeClosedIcon /> : <EyeOpenIcon /> }
      </div>
    </div>
  );
});

export default InputPassword;