'use client';

import { useState } from "react";

import { FormState } from "../types";
import Step1 from "./Step1";
import Step2 from "./Step2";
import { useRouter } from "next/navigation";
import Stepper from "./Stepper";

interface Props {
  categories: string[];
}

export default function Form({ categories }: Props) {
  const [step, setStep] = useState<0 | 1>(0);
  const [form, setForm] = useState<FormState | null>(null);

  const router = useRouter();

  return (
    <div className="grow">
      <h2 className="self-center text-lg font-semibold mb-10 text-center">Карточка товара</h2>

      <Stepper step={step} />
      <div className="w-[90%] max-w-[600px] mx-auto">
        <Step1
          setForm={setForm}
          goToNextStep={() => {
            setStep(1);
            router.push('/account/addproduct/?step=1');
          }}
          categories={categories}
          show={step === 0}
        />
        <Step2
          form={form}
          goToPrevStep={() => {
            setStep(0);
            router.back();
          }}
          show={step === 1}
        />
      </div>
    </div>
  );
}