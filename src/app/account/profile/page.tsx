import { getAPI } from "@/supabase/api";
import { createServerComponentSupabaseClient } from "@/supabase/utils_server";
import Form from "./Form";

export default async function Profile() {
  const api = getAPI(createServerComponentSupabaseClient());
  const profileData = await api.getCurrentUserProfileData();

  return (
    <div className="relative grow flex justify-center items-center">
      <Form profileData={profileData!} />
      <a
        className="absolute top-5 right-5 border border-black px-3 py-1 rounded-sm transition-all hover:bg-black hover:text-white"
        href="/auth/sign-out">Выйти</a>
    </div>
  );
}