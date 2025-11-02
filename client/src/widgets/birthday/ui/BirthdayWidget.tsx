import { isRotate90, type AnimationType } from '@/shared/lib';
import { LoadingThreeDotsJumping } from '@/shared/ui';

interface BirthdayWidgetProps {
  rotate: number;
  animation: AnimationType;
}

export function BirthdayWidget({ rotate, animation }: BirthdayWidgetProps) {
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingThreeDotsJumping />
      </div>
    );
  }

  return (
    <div className=" flex h-full w-full items-center justify-center rounded-lg border-3 border-[var(--border)] border-dashed">
      <div className="text-center">
        <p className="font-medium text-2xl">Birthday Widget Placeholder</p>
        <p className="mt-2 text-xl">
          rotate: {rotate}, animation: {animation}
        </p>
      </div>
    </div>
  );
}
