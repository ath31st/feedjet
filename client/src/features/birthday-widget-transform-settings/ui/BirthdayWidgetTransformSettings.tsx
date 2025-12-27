import {
  useGetBirthdayWidgetTransformByMonth,
  useUpsertBirthdayWidgetTransform,
  type BirthdayWidgetTransform,
} from '@/entities/birthday-widget-transform';
import { useEffect, useState } from 'react';
import { MonthTabs } from './MonthTabs';
import { TransformPreview } from './TransformPreview';
import {
  buildBackgroundUrl,
  useGetBackgroundByMonth,
} from '@/entities/birthday-background';
import { useGetBirthdaysByMonth } from '@/entities/birthday';
import { SliderControl } from './SliderControl';
import { ColorControl } from './ColorControl';
import { IconButton } from '@/shared/ui/common';
import { ResetIcon } from '@radix-ui/react-icons';
import { SaveIcon } from 'lucide-react';

export function BirthdayWidgetTransformSettings() {
  const currentMonth = new Date().getMonth() + 1;
  const [month, setMonth] = useState(currentMonth);

  const { data: birthdays = [], isLoading: birthdaysIsLoading } =
    useGetBirthdaysByMonth(month);
  const { data: transformData, isLoading: transformIsLoading } =
    useGetBirthdayWidgetTransformByMonth(month);
  const { mutate: upsertTransform, isPending } =
    useUpsertBirthdayWidgetTransform();
  const { data: backgroundFileName, isLoading: backgroundIsLoading } =
    useGetBackgroundByMonth(month);
  const backgroundUrl = backgroundFileName
    ? buildBackgroundUrl(backgroundFileName)
    : null;

  const [localTransform, setLocalTransform] =
    useState<BirthdayWidgetTransform | null>(null);

  const handleSave = () => {
    if (localTransform) {
      upsertTransform(localTransform);
    }
  };

  const handleReset = () => {
    if (transformData) {
      setLocalTransform(transformData);
    }
  };

  useEffect(() => {
    if (transformData) setLocalTransform(transformData);
  }, [transformData]);

  if (
    transformIsLoading ||
    backgroundIsLoading ||
    birthdaysIsLoading ||
    !localTransform
  ) {
    return <div className="w-full text-(--meta-text) text-sm">Загрузка...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <MonthTabs value={month} onChange={setMonth} />

      <div className="flex items-center gap-6">
        <div className="flex-1">
          <TransformPreview
            transformData={localTransform}
            backgroundUrl={backgroundUrl}
            birthdays={birthdays}
          />
        </div>

        {localTransform && (
          <div className="grid w-full grid-cols-2 gap-x-4 gap-y-3">
            <SliderControl
              label="Ось Х (в %)"
              value={localTransform.posX}
              min={10}
              max={100}
              step={1}
              onChange={(val) =>
                setLocalTransform((prev) =>
                  prev ? { ...prev, posX: val } : prev,
                )
              }
            />

            <SliderControl
              label="Ось Y (в %)"
              value={localTransform.posY}
              min={10}
              max={100}
              step={1}
              onChange={(val) =>
                setLocalTransform((prev) =>
                  prev ? { ...prev, posY: val } : prev,
                )
              }
            />

            <SliderControl
              label="Ширина (в %)"
              value={localTransform.width}
              min={0}
              max={100}
              step={1}
              onChange={(val) =>
                setLocalTransform((prev) =>
                  prev ? { ...prev, width: val } : prev,
                )
              }
            />

            <SliderControl
              label="Высота (в %)"
              value={localTransform.width}
              min={0}
              max={100}
              step={1}
              onChange={(val) =>
                setLocalTransform((prev) =>
                  prev ? { ...prev, height: val } : prev,
                )
              }
            />

            <SliderControl
              label="Поворот X (в град)"
              value={localTransform.rotateX}
              min={-90}
              max={90}
              step={1}
              onChange={(val) =>
                setLocalTransform((prev) =>
                  prev ? { ...prev, rotateX: val } : prev,
                )
              }
            />

            <SliderControl
              label="Поворот Y (в град)"
              value={localTransform.rotateY}
              min={-90}
              max={90}
              step={1}
              onChange={(val) =>
                setLocalTransform((prev) =>
                  prev ? { ...prev, rotateY: val } : prev,
                )
              }
            />

            <SliderControl
              label="Поворот Z (в град)"
              value={localTransform.rotateZ}
              min={-180}
              max={180}
              step={1}
              onChange={(val) =>
                setLocalTransform((prev) =>
                  prev ? { ...prev, rotateZ: val } : prev,
                )
              }
            />

            <SliderControl
              label="Масштаб шрифта (в %)"
              value={localTransform.fontScale}
              min={50}
              max={300}
              step={1}
              onChange={(val) =>
                setLocalTransform((prev) =>
                  prev ? { ...prev, fontScale: val } : prev,
                )
              }
            />

            <SliderControl
              label="Межстрочный интервал (в %)"
              value={localTransform.lineGap}
              min={50}
              max={300}
              step={1}
              onChange={(val) =>
                setLocalTransform((prev) =>
                  prev ? { ...prev, lineGap: val } : prev,
                )
              }
            />

            <SliderControl
              label="Радиус тени (в px)"
              value={localTransform.shadowBlur}
              min={0}
              max={10}
              step={1}
              onChange={(val) =>
                setLocalTransform((prev) =>
                  prev ? { ...prev, shadowBlur: val } : prev,
                )
              }
            />

            <ColorControl
              label="Цвет текста"
              value={localTransform.textColor ?? '#ffffff'}
              onChange={(val) =>
                setLocalTransform((prev) =>
                  prev ? { ...prev, textColor: val } : prev,
                )
              }
            />

            <div className="flex flex-row items-center justify-center gap-10">
              <IconButton
                onClick={handleReset}
                tooltip="Сбросить настройки"
                ariaLabel="Сбросить настройки"
                icon={<ResetIcon className="h-5 w-5 cursor-pointer" />}
              />

              <IconButton
                onClick={handleSave}
                disabled={isPending}
                tooltip="Сохранить настройки"
                ariaLabel="Сохранить настройки"
                icon={<SaveIcon className="h-5 w-5 cursor-pointer" />}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
