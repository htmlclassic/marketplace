'use client';

import { useState } from "react";
import handleSubmit from "./serverAction";
import LoadingSpinner from "@/src/components/LoadingSpinner";

interface Props {
  categories: string[];
}

export default function Form({ categories }: Props) {
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      action={handleSubmit}
      className="flex flex-col w-[95%] sm:w-[500px] m-auto gap-4 rounded-lg"
      onSubmit={() => setSubmitting(true)}
    >
      <h2 className="self-center text-lg font-bold mb-10">Продать товар</h2>
      <label className="flex flex-col gap-2">
        Название:
        <textarea required rows={2} name="title" className="border p-1 rounded bg-gray-50 focus:outline-none focus:bg-white" ></textarea>
      </label>
      <label className="flex flex-col gap-2">
        Описание:
        <textarea required rows={10} name="description" className="border p-1 rounded bg-gray-50 focus:outline-none focus:bg-white" ></textarea>
      </label>
      <label className="flex flex-col gap-2">
        Категория:
        <select name="category" className="py-2 px-3 rounded border">
        <option value="">Выбрать категорию</option>
        {
          categories.map(name =>
            <option key={name} value={name}>{name}</option>
          )
        }
      </select>
      </label>
      <label className="flex flex-col gap-2">
        Цена:
        <input min="1" max="2147483647" required type="number" name="price" className="border p-1 rounded bg-gray-50 focus:outline-none focus:bg-white" />
      </label>
      <label className="flex flex-col gap-2">
        Количество:
        <input min="1" max="32767" required type="number" name="quantity" className="border p-1 rounded bg-gray-50 focus:outline-none focus:bg-white" />
      </label>
      <div className="flex flex-col">
        <input required type="file" accept="image/avif,image/gif,image/jpeg,image/png,image/svg+xml,image/webp" multiple name="files" />
        <span className="text-[0.7rem] text-gray-600">Можно загрузить изображения в сумме 4.5мб максимум</span>
      </div>
      <button type="submit" className="border rounded-md p-2 transition-all hover:border-black">Выставить на продажу</button>

      <div className={`${submitting ? 'flex ' : 'hidden '} rounded-lg bg-white opacity-90 fixed top-0 left-0 w-full h-full justify-center items-center flex-col gap-2`}>
        <LoadingSpinner />
        <div>Добавляем ваш товар</div>
      </div>
    </form>
  );
}