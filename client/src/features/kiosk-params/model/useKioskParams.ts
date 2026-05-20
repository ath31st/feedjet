import { useParams } from 'react-router-dom';

export function useKioskParams() {
  const { slug = 'default' } = useParams();
  return { slug };
}
