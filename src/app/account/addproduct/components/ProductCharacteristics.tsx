'use client';

import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { ChangeEvent, useState } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormState } from "../types";
import FieldError from "./FieldError";

interface Props {
  register: UseFormRegister<FormState>;
  errors: FieldErrors<FormState>;
}

export default function ProductCharacteristics({ register, errors }: Props) {
  const [customFieldsCount, setCustomFieldsCount] = useState(1);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    const value = e.target.value;
                  
    if (value.length && customFieldsCount === i + 1) {
      setCustomFieldsCount(c => c + 1);
    }

    if (!value.length && customFieldsCount === i + 2) {
      setCustomFieldsCount(c => c - 1);
    }
  };

  return (
    <div className="gap-3 flex flex-col">
      <span className="font-medium py-5">Стандартные характеристики</span>
      <div>
        <Label htmlFor="product_size">Размеры (мм)</Label>
        <div className="flex gap-3 flex-col sm:flex-row"> 
          <Input
            { ...register('size_x', { valueAsNumber: true }) }
            id="product_size"
            className="py-5"
            placeholder="Длина"
            type="number"
            />
          <Input
            { ...register('size_y', { valueAsNumber: true }) }
            className="py-5"
            placeholder="Ширина"
            type="number"
          />
          <Input
            { ...register('size_z', { valueAsNumber: true }) }
            className="py-5"
            placeholder="Высота (толщина)"
            type="number"
          />
        </div>
        <FieldError error={errors.size_x || errors.size_y || errors.size_z} />
      </div>
      <div>
        <Label htmlFor="product_weight">Вес (г)</Label>
        <Input
          { ...register('weight', { valueAsNumber: true }) }
          id="product_weight"
          className="py-5"
          type="number"
        />
        <FieldError error={errors.weight} />
      </div>
      <div className="flex flex-col gap-3">
        <span className="font-medium py-5">
          Пользовательские характеристики (опционально)
        </span>
        {
          new Array(customFieldsCount).fill(0).map((el, i) =>
            <div className="flex gap-3 flex-col sm:flex-row" key={i}>
              <Input
                { ...register(`custom_characterstics.${i}.key`) }
                className="py-5"
                placeholder="Название"
              />
              <Input
                { ...register(`custom_characterstics.${i}.value`) }
                className="py-5"
                placeholder="Значение"
                onChange={e => handleChange(e, i)}
              />
            </div>
          )
        }
      </div>
    </div>
  );
}