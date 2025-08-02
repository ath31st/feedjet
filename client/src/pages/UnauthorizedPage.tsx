import { Link } from 'react-router-dom';

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div
        className="flex flex-col items-center gap-8 rounded-xl p-12"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--card-bg)',
        }}
      >
        <h1 className="text-4xl">Требуется авторизация</h1>
        <Link
          to="/login"
          className="text-2xl underline transition-opacity hover:opacity-80"
        >
          Перейти на страницу входа
        </Link>
      </div>
    </div>
  );
}
