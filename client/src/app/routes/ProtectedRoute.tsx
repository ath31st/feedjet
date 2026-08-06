import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMe } from '@/features/auth';
import { LoadingCenter } from '@/shared/ui';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { data, isLoading, error } = useMe();

  useEffect(() => {
    if (error?.data?.code === 'UNAUTHORIZED') {
      navigate('/login', { replace: true });
    }
  }, [error, navigate]);

  if (isLoading) {
    return <LoadingCenter fullScreen spinnerSize="4xl" />;
  }

  if (error?.data?.code === 'UNAUTHORIZED') {
    return null;
  }

  if (!data) {
    return null;
  }

  return <>{children}</>;
}
