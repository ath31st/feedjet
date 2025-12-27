import { BirthdayTransformView, LoadingThreeDotsJumping } from '@/shared/ui';
import { useBirthdayWidgetModel } from '../model/useBirthdayWidget';
import { calcFontSize } from '../lib/selectors';

interface BirthdayWidgetProps {
  rotate: number;
}

export function BirthdayWidget({ rotate }: BirthdayWidgetProps) {
  const {
    isLoading,
    birthdays,
    backgroundUrl,
    isEffectiveXl,
    transformData,
    isLoadingTransform,
  } = useBirthdayWidgetModel(rotate);

  const fontSizeXl = calcFontSize(isEffectiveXl, birthdays.length);

  if (isLoading || isLoadingTransform) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoadingThreeDotsJumping />
      </div>
    );
  }

  if (!birthdays.length) {
    const monthName = new Date().toLocaleString('ru-RU', { month: 'long' });

    return (
      <div
        className={`relative flex h-full w-full items-center justify-center text-${fontSizeXl}xl overflow-hidden text-(--meta-text)`} // relative + overflow-hidden
      >
        <span>Месяц {monthName} не содержит дней рождения</span>
      </div>
    );
  }

  return (
    <div
      className={
        backgroundUrl
          ? 'fixed inset-0 flex flex-col items-center bg-center bg-cover bg-no-repeat p-4'
          : 'flex h-full w-full flex-col items-center rounded-lg border-(--border) border-4 bg-(--card-bg) bg-center bg-cover bg-no-repeat'
      }
      style={{
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
        perspective: '1000px',
      }}
    >
      {transformData && (
        <BirthdayTransformView
          transformData={transformData}
          birthdays={birthdays}
          showDebugBorder={false}
        />
      )}
    </div>
  );
}
