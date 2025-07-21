import { Link } from 'react-router-dom';

export function UnauthorizedPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div
        className="flex flex-col items-center gap-8 4k:rounded-4xl rounded-xl 4k:p-28 p-12"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--card-bg)',
        }}
      >
        <h1 className="4k:text-8xl text-4xl">Требуется авторизация</h1>
        <Link
          to="/login"
          className="4k:text-5xl text-2xl underline transition-opacity hover:opacity-80"
        >
          Перейти на страницу входа
        </Link>
      </div>
    </div>
  );
}
