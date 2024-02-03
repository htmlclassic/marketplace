import Link from 'next/link';
import Messages from '../messages';
import SubmitButton from '../SubmitButton';
import { signIn } from '../actions';

export default async function Login() {
  return (
    <form
      className="flex flex-col w-full justify-center gap-3 max-w-[400px] bg-white p-7 rounded-lg"
      action={signIn}
    >
      <h1 className="text-lg mb-5 text-center">Вход</h1>
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
      <p className="text-sm flex gap-1">
        Нет аккаунта?
        <Link
          href="/signup"
          className="text-[rgb(111,201,148)] hover:underline"
        >Регистрация</Link>
      </p>
      <SubmitButton>Войти</SubmitButton>
      <Messages />
    </form>
  );
}
