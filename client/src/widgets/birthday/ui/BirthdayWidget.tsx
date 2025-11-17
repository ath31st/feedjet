import type { AnimationType } from '@/shared/lib';
import { LoadingThreeDotsJumping } from '@/shared/ui';
import { BirthdayCard } from './BirthdayCard';
import { BirthdayGreeting } from './BirthdayGreeting';
import { COMPANY_NAME } from '@/shared/config';
import { useBirthdayWidgetModel } from '../model/useBirthdayWidget';
import { calcFontSize, calcWidgetWidth } from '../lib/selectors';

interface BirthdayWidgetProps {
  rotate: number;
  animation: AnimationType;
}

export function BirthdayWidget({ rotate }: BirthdayWidgetProps) {
  const {
    isLoading,
    birthdays,
    backgroundUrl,
    isEffectiveXl,
    isTwoColumns,
    columns,
  } = useBirthdayWidgetModel(rotate);

  const fontSizeXl = calcFontSize(isEffectiveXl, birthdays.length);
  const widgetWidth = calcWidgetWidth(isEffectiveXl);

  if (isLoading) {
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
        className={`flex h-full w-full items-center justify-center text-${fontSizeXl}xl text-[var(--meta-text)]`}
      >
        Месяц {monthName} не содержит дней рождения
      </div>
    );
  }

  return (
    <div
      className={
        backgroundUrl
          ? 'fixed inset-0 z-10 flex flex-col items-center bg-center bg-cover bg-no-repeat p-4'
          : 'flex h-full w-full flex-col items-center rounded-lg border-4 border-[var(--border)] bg-[var(--card-bg)] bg-center bg-cover bg-no-repeat'
      }
      style={{
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
      }}
    >
      <div
        className="mt-6 flex h-full flex-col items-center justify-start gap-10"
        style={{ width: `${widgetWidth}%` }}
      >
        <BirthdayGreeting
          isEffectiveXl={isEffectiveXl}
          companyName={COMPANY_NAME}
        />
        {isTwoColumns ? (
          <div className="grid h-full w-full grid-cols-2 justify-center gap-20">
            {columns.map((column, i) => (
              <div
                key={i === 0 ? 'left' : 'right'}
                className="flex flex-col gap-4"
              >
                {column.map((birthday, index) => (
                  <BirthdayCard
                    key={birthday.id}
                    birthday={birthday}
                    fontSizeXl={fontSizeXl}
                    delay={index * 0.5}
                    duration={1.3}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full w-full flex-col justify-center gap-4">
            {birthdays.map((birthday, index) => (
              <BirthdayCard
                key={birthday.id}
                birthday={birthday}
                fontSizeXl={fontSizeXl}
                delay={index * 0.5}
                duration={1.3}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
