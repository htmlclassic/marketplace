import { redirect } from "next/navigation";

export default function Page() {
  // temp solution. idk what to show on /account
  redirect('/account/profile');

  return (
    null
  );
}