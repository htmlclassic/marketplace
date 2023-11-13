'use client';

import { useState } from "react";
import handleSubmit from "./serverAction";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from 'dayjs';
import clsx from "clsx";

interface FormProps {
  profileData: Profile;
}

export default function Form({ profileData }: FormProps) {
  const [edit, setEdit] = useState(false);
  const INPUT_CLASS = clsx({
    'p-2 border border-dashed': true,
    'border-gray-400': edit,
    'border-transparent': !edit
  });

  return (
    <form
      action={handleSubmit}
      onSubmit={() => setEdit(false)}
      className="rounded-lg w-[90vw] min-[500px]:w-auto flex flex-col gap-x-3 gap-y-6 border p-10 relative after:block after:content-['Личные_данные'] after:bg-white after:absolute after:top-0 after:-translate-y-1/2 after:p-1"
    >
      <label className="flex justify-between gap-x-4 gap-y-2 flex-col min-[500px]:flex-row min-[500px]:items-center">
        <span className="font-bold">Баланс: </span>
        <input
          type="number"
          defaultValue={profileData.balance ?? ''}
          disabled={!edit}
          name="balance"
          className={INPUT_CLASS}
        />
      </label>
      <label className="flex justify-between gap-x-4 gap-y-2 flex-col min-[500px]:flex-row min-[500px]:items-center">
        <span className="font-bold">Пвсевдоним: </span>
        <input
          type="text"
          defaultValue={profileData.username ?? ''}
          disabled={!edit}
          name="username"
          className={INPUT_CLASS}
        />
      </label>
      <label className="flex justify-between gap-x-4 gap-y-2 flex-col min-[500px]:flex-row min-[500px]:items-center">
        <span className="font-bold">Имя: </span>
        <input
          type="text"
          defaultValue={profileData.first_name ?? ''}
          disabled={!edit}
          name="first_name"
          className={INPUT_CLASS}
        />
      </label>
      <label className="flex justify-between gap-x-4 gap-y-2 flex-col min-[500px]:flex-row min-[500px]:items-center">
        <span className="font-bold">Фамилия: </span>
        <input
          type="text"
          defaultValue={profileData.last_name ?? ''}
          disabled={!edit}
          name="last_name"
          className={INPUT_CLASS}
        />
      </label>
      <label className="flex justify-between gap-x-4 gap-y-2 flex-col min-[500px]:flex-row min-[500px]:items-center">
        <span className="font-bold">Дата рождения: </span>
        <DatePicker
          format="DD/MM/YYYY"
          defaultValue={profileData.birthdate && dayjs(profileData.birthdate)}
          slotProps={{ textField: { name: 'birthdate' }}}
          disabled={!edit}
        />
      </label>
      {
        edit
          ? <input className="self-start border-2 px-9 py-2 transition-all bg-transparent hover:border-transparent hover:bg-[rgba(0,0,0,0.5)] hover:text-white mt-6 cursor-pointer rounded-md" type="submit" value="Сохранить" />
          : <button onClick={() => setEdit(edit => !edit)} className="self-start border-2 px-9 py-2 transition-all bg-transparent hover:border-transparent hover:bg-[rgba(0,0,0,0.5)] hover:text-white mt-6 rounded-md">
              Изменить
            </button>
      }
    </form>
  );
};