import { useState } from 'react';
import { useLogin } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const navigate = useNavigate();
  const handleLogin = useLogin();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin.mutate(
      { login, password },
      {
        onSuccess: () => {
          navigate('/admin', { replace: true });
        },
      },
    );
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex w-1/3 max-w-x flex-col gap-6 4k:rounded-4xl rounded-xl 4k:p-28 p-12 4k:text-4xl text-base"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--card-bg)',
          color: 'var(--text)',
        }}
      >
        <h1 className="text-center 4k:text-8xl text-4xl">Вход</h1>

        <input
          type="text"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
          className="rounded-xl border border-[var(--border)] bg-transparent px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded-xl border border-[var(--border)] bg-transparent px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
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
