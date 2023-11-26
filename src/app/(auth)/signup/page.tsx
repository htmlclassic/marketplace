import Messages from "../messages";

export default function Page() {
  return (
    <form
      className="flex flex-col w-full justify-center gap-3 max-w-[400px] bg-white p-7 rounded-lg"
      method="post"
      action={'/auth/sign-up'}
    >
      <h1 className="text-lg mb-5 text-center">Регистрация</h1>
      <input
        className="rounded-md px-4 py-2 bg-inherit border"
        name="first_name"
        placeholder="Имя"
        required
      />
      <input
        className="rounded-md px-4 py-2 bg-inherit border"
        name="last_name"
        placeholder="Фамилия"
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
      <button
        className="border border-gray-700 rounded px-4 py-2 mt-5 transition-all duration-300 hover:border-transparent hover:bg-[rgb(130,235,174)]"
      >
        Зарегистрироваться
      </button>
      <Messages />
    </form>
  );
}