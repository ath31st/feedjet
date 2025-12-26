import { useGetBirthdayWidgetTransformByMonth } from '@/entities/birthday-widget-transform';
import { useState } from 'react';
import { MonthTabs } from './MonthTabs';
import { TransformPreview } from './TransformPreview';
import {
  buildBackgroundUrl,
  useGetBackgroundByMonth,
} from '@/entities/birthday-background';
import { useGetBirthdaysByMonth } from '@/entities/birthday';

export function BirthdayWidgetTransformSettings() {
  const currentMonth = new Date().getMonth() + 1;
  const [month, setMonth] = useState(currentMonth);

  const { data: birthdays = [], isLoading: birthdaysIsLoading } =
    useGetBirthdaysByMonth(month);
  const { data: transformData, isLoading: transformIsLoading } =
    useGetBirthdayWidgetTransformByMonth(month);
  const { data: backgroundFileName, isLoading: backgroundIsLoading } =
    useGetBackgroundByMonth(month);
  const backgroundUrl = backgroundFileName
    ? buildBackgroundUrl(backgroundFileName)
    : null;

  if (
    transformIsLoading ||
    backgroundIsLoading ||
    birthdaysIsLoading ||
    !transformData
  ) {
    return <div className="w-full text-(--meta-text) text-sm">Загрузка...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <MonthTabs value={month} onChange={setMonth} />

      <div className="flex gap-6">
        <TransformPreview
          transformData={transformData}
          backgroundUrl={backgroundUrl}
          birthdays={birthdays}
        />

        <div className="flex flex-col gap-2 text-(--meta-text) text-sm">
          <p>
            Здесь настраивается положение и размер блока с поздравлениями для
            выбранного месяца.
          </p>
          <p>Фон соответствует изображению, выбранному для месяца.</p>
          <p>В дальнейшем здесь появятся:</p>
          <ul className="list-disc pl-4">
            <li>позиционирование по X / Y</li>
            <li>ширина и высота блока</li>
            <li>наклон и поворот</li>
            <li>масштаб текста</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
