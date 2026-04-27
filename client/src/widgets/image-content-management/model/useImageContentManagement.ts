import { useRotationInterval } from '@/features/image-rotation-interval';

export function useImageContentManagement(kioskId: number) {
  const { value: globalDuration, update: updateGlobalDuration } =
    useRotationInterval(kioskId);

  return {
    globalDuration,
    updateGlobalDuration,
  };
}
