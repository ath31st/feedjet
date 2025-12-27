import type { Birthday } from '@/entities/birthday';
import type { BirthdayWidgetTransform } from '@/entities/birthday-widget-transform';
import { BirthdayTransformView } from '@/shared/ui';

interface TransformPreviewProps {
  backgroundUrl: string | null;
  transformData: BirthdayWidgetTransform;
  birthdays: Birthday[];
}

export function TransformPreview({
  backgroundUrl,
  transformData,
  birthdays,
}: TransformPreviewProps) {
  return (
    <div
      className="relative h-[400px] w-[711px] overflow-hidden rounded-lg border border-(--border) bg-neutral-900"
      style={{ perspective: '900px' }}
    >
      {backgroundUrl && (
        <img
          src={backgroundUrl}
          alt="Background preview"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <BirthdayTransformView
        transformData={transformData}
        birthdays={birthdays}
        showDebugBorder={true}
      />
    </div>
  );
}
