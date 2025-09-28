import { useParams, useSearchParams } from 'react-router-dom';
import { parseRotateParam } from '@/shared/lib/parseRotateParam';
import { parseAnimationParam } from '@/shared/lib/parseAnimationParam';

export function useKioskParams() {
  const { slug = 'default' } = useParams();
  const [searchParams] = useSearchParams();
  const rotate = parseRotateParam(searchParams.get('rotate'));
  const animation = parseAnimationParam(searchParams.get('animation'));

  return { rotate, animation, slug };
}
