import { Outlet } from 'react-router-dom';

export function CommonLayout() {
  return (
    <div className="">
      <div className="mx-auto w-full max-w-7xl">
        <Outlet />
      </div>
    </div>
  );
}
