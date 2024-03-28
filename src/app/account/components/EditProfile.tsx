'use client';

import { Dispatch, SetStateAction, useState } from "react";
import { editProfileAction } from "../actions";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from 'dayjs';
import SubmitButton from "./SubmitButton";
import clsx from "clsx";

interface FormProps {
  profileData: Profile;
  setProfileData: Dispatch<SetStateAction<Profile>>;
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}

export default function EditProfile({
  profileData,
  setProfileData,
  show,
  setShow
}: FormProps) {
  return (
    <div
      onClick={() => setShow(false)}
      className={clsx({
        "flex fixed top-0 left-0 w-screen h-screen z-40 justify-center items-center cursor-pointer": true,
        "pointer-events-none": !show,
      })}
    >
      <div
        className={clsx({
          "fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50": true,
          "block": show,
          "hidden": !show
        })}
      ></div>
      <form
        onClick={e => e.stopPropagation()}
        action={editProfileAction}
        className={clsx({
          "relative flex flex-col gap-3 p-5 sm:p-10 rounded-lg w-[90vw] max-w-[500px] bg-white z-50 cursor-default transition-all": true,
          "scale-50 opacity-0": !show,
          "scale-100 opacity-100": show
        })}
      >
        <label className="flex flex-col gap-2">
          <span className="font-bold">Имя: </span>
          <input
            type="text"
            defaultValue={profileData.name || ''}
            name="name"
            className="border p-2 rounded-md disabled:border-red-400"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-bold">Почта: </span>
          <input
            type="text"
            defaultValue={profileData.email ?? ''}
            name="email"
            className="border p-2 rounded-md disabled:border-red-400"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-bold">Дата рождения: </span>
          <DatePicker
            format="DD/MM/YYYY"
            defaultValue={profileData.birthdate && dayjs(profileData.birthdate)}
            slotProps={{ textField: { name: 'birthdate' }}}
          />
        </label>
        <div
          onClick={() => setShow(false)}
          className="w-max"
        >
          <SubmitButton setProfileData={setProfileData} />
        </div>
      </form>
    </div>
  );
};