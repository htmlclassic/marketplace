import SubmitButton from "../components/SubmitButton";
import { signUp } from "../actions";
import Messages from "../messages";

export default function Page() {
  return (
    <form
      className="flex flex-col w-full justify-center gap-3 max-w-[400px] bg-white p-7 rounded-lg"
      action={signUp}
    >
      <h1 className="text-lg mb-5 text-center">Регистрация</h1>
      <input
        className="rounded-md px-4 py-2 bg-inherit border"
        name="name"
        placeholder="Имя"
        required
      />
      <input
        className="rounded-md px-4 py-2 bg-inherit border"
        name="email"
        placeholder="Почта"
        required
      />
      <input
        className="rounded-md px-4 py-2 bg-inherit border"
        type="password"
        name="password"
        placeholder="Пароль"
        required
        minLength={6} // Supabase default min value for a password
      />
      <SubmitButton>Зарегистрироваться</SubmitButton>
      <Messages />
    </form>
  );
}