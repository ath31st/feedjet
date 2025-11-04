import { useState } from 'react';
import { useLogin } from '../model/useAuth';
import { CommonButton } from '@/shared/ui/common';

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin.mutate(
      { login, password },
      {
        onSuccess,
      },
    );
  };

  return (
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
        className="rounded-lg border border-[var(--border)] bg-transparent px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
      />

      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="rounded-lg border border-[var(--border)] bg-transparent px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
      />

      <CommonButton type="submit">Войти</CommonButton>
    </form>
  );
}
