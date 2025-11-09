import { useGetBirthdaysByMonth, type Birthday } from '@/entities/birthday';
import { isRotate90, type AnimationType } from '@/shared/lib';
import { LoadingThreeDotsJumping } from '@/shared/ui';
import { useEffect, useState } from 'react';
import { BirthdayCard } from './BirthdayCard';

interface BirthdayWidgetProps {
  rotate: number;
  animation: AnimationType;
}

export function BirthdayWidget({ rotate, animation }: BirthdayWidgetProps) {
  const isRotate = isRotate90(rotate);
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const currentMonth = new Date().getMonth() + 1;
  const { isLoading, data: fetchedBirthdays } =
    useGetBirthdaysByMonth(currentMonth);
  const fontSizeXl = isRotate ? 3 : 5;
  const cardWidth = isRotate ? 90 : 80;

  useEffect(() => {
    setBirthdays(fetchedBirthdays || []);
  });

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
    <div className="flex h-full w-full items-center justify-center rounded-lg border-3 border-[var(--border)] border-dashed">
      <div className={`w-[${cardWidth}%] flex flex-col gap-4`}>
        {birthdays.map((birthday) => (
          <BirthdayCard
            key={birthday.id}
            birthday={birthday}
            fontSizeXl={fontSizeXl}
          />
        ))}
      </div>
    </div>
  );
}
