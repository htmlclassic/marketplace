'use client';

import { Button } from "@/src/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { useFormStatus } from "react-dom";

interface Props {
  children: React.ReactNode;
  icon?: React.ReactNode;
  isSubmitting?: (value: boolean) => void;
}

export default function SubmitButton({ children, isSubmitting, icon }: Props) {
  const { pending } = useFormStatus();

  useEffect(() => {
    if (isSubmitting) isSubmitting(pending);
  }, [pending]);

  return (
    <Button
      variant='default'
      className="relative py-6 px-3 mt-3 group"
      disabled={pending}
    >
      <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300 group-hover:translate-x-1/2">  
        {
          pending
            ?
              <ReloadIcon className="w-[20px] h-[20px] animate-spin-fast" />
            : icon
        }
      </div>
      <span className="ml-3 text-base">{children}</span>
    </Button>
  );
}