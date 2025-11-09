import { useGetBirthdaysByMonth, type Birthday } from '@/entities/birthday';
import { isRotate90, useIsXl, type AnimationType } from '@/shared/lib';
import { LoadingThreeDotsJumping } from '@/shared/ui';
import { useEffect, useState } from 'react';
import { BirthdayCard } from './BirthdayCard';
import { BirthdayGreeting } from './BirthdayGreeting';
import { COMPANY_NAME } from '@/shared/config';

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
  const fontSizeXl = isEffectiveXl ? 5 : 3;
  const widgetWidth = isEffectiveXl ? 80 : 90;

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
    <div className="flex h-full w-full flex-col items-center rounded-lg border-4 border-[var(--border)] bg-[var(--card-bg)]">
      <div
        className="flex h-full flex-col items-center justify-center gap-20"
        style={{ width: `${widgetWidth}%` }}
      >
        <BirthdayGreeting
          isEffectiveXl={isEffectiveXl}
          companyName={companyName}
        />
        <div className="flex w-full flex-col gap-6">
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
      </div>
    </div>
  );
}
