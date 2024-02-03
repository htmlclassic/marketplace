'use client';

import LoadingSpinner from "@/src/components/LoadingSpinner";
import { useFormStatus } from "react-dom";

interface Props {
  children: React.ReactNode;
}

export default function SubmitButton({ children }: Props) {
  const { pending } = useFormStatus();

  return (
    <button
        disabled={pending}
        className="border flex justify-center items-center border-gray-500 disabled:border-gray-100 rounded h-10 mt-5 transition-all duration-300 enabled:hover:border-transparent enabled:hover:bg-[rgb(130,235,174)]"
    >
      {
        pending
          ?
            <div className="text-[rgb(130,235,174)] w-8 h-8">
              <LoadingSpinner />
            </div>
          : 
            children
      }
    </button>
  );
}