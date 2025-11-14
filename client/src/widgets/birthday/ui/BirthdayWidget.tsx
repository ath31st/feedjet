import { useGetBirthdaysByMonth, type Birthday } from '@/entities/birthday';
import { isRotate90, useIsXl, type AnimationType } from '@/shared/lib';
import { LoadingThreeDotsJumping } from '@/shared/ui';
import { useEffect, useState } from 'react';
import { BirthdayCard } from './BirthdayCard';
import { BirthdayGreeting } from './BirthdayGreeting';
import { COMPANY_NAME } from '@/shared/config';
import { fontSizeBirthdayCard } from '../lib/fontSizeBirhtdayCard';

interface BirthdayWidgetProps {
  rotate: number;
  animation: AnimationType;
}

export function BirthdayWidget({ rotate }: BirthdayWidgetProps) {
  const companyName = COMPANY_NAME || 'Company Name';
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const currentMonth = new Date().getMonth() + 1;
  const { isLoading, data: fetchedBirthdays } =
    useGetBirthdaysByMonth(currentMonth);
  const isXl = useIsXl();
  const isEffectiveXl = isRotate90(rotate) ? !isXl : isXl;
  let fontSizeXl = isEffectiveXl ? 5 : 3;
  if (isEffectiveXl) {
    fontSizeXl = fontSizeBirthdayCard(birthdays.length);
  }
  const widgetWidth = isEffectiveXl ? 80 : 90;
  const isTwoColumns = birthdays.length > 12;
  const midIndex = Math.ceil(birthdays.length / 2);
  const [leftColumn, rightColumn] = isTwoColumns
    ? [birthdays.slice(0, midIndex), birthdays.slice(midIndex)]
    : [birthdays, []];

  useEffect(() => {
    setBirthdays(fetchedBirthdays || []);
  }, [fetchedBirthdays]);

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
      //className="relative z-10 flex h-full w-full flex-col items-center rounded-lg border-4 border-[var(--border)] bg-[var(--card-bg)] bg-center bg-cover bg-no-repeat"
      className="relative flex h-full w-full flex-col items-center rounded-lg border-4 border-[var(--border)] bg-[var(--card-bg)] bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: 'url("/src/shared/assets/images/background.jpg")',
      }}
    >
      <div
        className="mt-6 flex h-full flex-col items-center justify-start gap-10"
        style={{ width: `${widgetWidth}%` }}
      >
        <BirthdayGreeting
          isEffectiveXl={isEffectiveXl}
          companyName={companyName}
        />
        {isTwoColumns ? (
          <div className="grid h-full w-full grid-cols-2 justify-center gap-20">
            {[leftColumn, rightColumn].map((column, i) => (
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
