'use client';

import dayjs from "dayjs";
import EditProfile from "./EditProfile";
import { signOut } from "@/src/app/(auth)/actions";
import { useState } from "react";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";

interface Props {
  profile: Profile;
}

export default function Profile({ profile: profileInitial }: Props) {
  const [signOutLoader, setSignOutLoader] = useState(false);
  const [profile, setProfile] = useState(profileInitial);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const name = profile.name;
  const birthdate = profile.birthdate ? dayjs(profile.birthdate).format('DD.MM.YYYY')
    : 'Не указано';

  if (signOutLoader) {
    return (
      <div className="fixed left-0 bg-white backdrop-blur-[1px] bg-opacity-30 top-0 w-screen h-screen flex justify-center items-center z-[60]">
        <div className="w-10 h-10 text-green-400">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="relative grow flex flex-col gap-10">
      <EditProfile
        profileData={profile}
        setProfileData={setProfile}
        show={showEditProfile}
        setShow={setShowEditProfile} 
      />
      <div>
        <h2 className="font-semibold text-xl mb-10">Учётные данные</h2>
        <div className="grid grid-cols-[repeat(2,max-content)] max-[360px]:grid-cols-1 gap-y-10 gap-x-20">
          <div>
            <div className="text-xs text-gray-600">
              Имя
            </div>
            {name}
          </div>
          <div>
            <div className="text-xs text-gray-600">
              Дата рождения
            </div>
            {birthdate}
          </div>
          <div>
            <div className="text-xs text-gray-600">
              Почта
            </div>
            {profile.email}
          </div>
        </div>
      </div>
      <div className="flex gap-5">
        <Button
          onClick={() => setShowEditProfile(true)}
          className="w-max"
        >
          Редактировать
        </Button>
        <Button className="w-max p-0">
          <Link href="/change-password" className="p-4">Сменить пароль</Link>
        </Button>
      </div>
      <Button
        variant="destructive"
        onClick={() => {
          setSignOutLoader(true);
          signOut();
        }}
        className="w-max"
      >
        Выйти из аккаунта
      </Button>
    </div>
  );
}