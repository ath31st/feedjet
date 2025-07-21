import { useState } from 'react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-6 4k:rounded-4xl rounded-xl 4k:p-28 p-12 4k:text-4xl text-base"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--card-bg)',
          color: 'var(--text)',
        }}
      >
        <h1 className="text-center font-semibold 4k:text-8xl text-4xl">Вход</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-xl border border-[var(--border)] bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--border)]"
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded-xl border border-[var(--border)] bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--border)]"
        />

        <button
          type="submit"
          className="mt-4 rounded-xl bg-[var(--button-bg)] py-2 text-[var(--button-text)] transition-opacity hover:opacity-60"
        >
          Войти
        </button>
      </form>
    </div>
  );
}
