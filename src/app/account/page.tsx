import Profile from "./components/Profile";
import { getUserProfileData } from "./utils";

export default async function Page() {
  const profile = await getUserProfileData();

  if (!profile) return (
    <div className="relative grow flex justify-center items-center">
      Ошибка. Данные профиля не были загружены.</div>
  );

  return (
    <Profile profile={profile} />
  );
}