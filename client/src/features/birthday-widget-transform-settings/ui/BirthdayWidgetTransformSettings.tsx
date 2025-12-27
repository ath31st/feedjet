import {
  useGetBirthdayWidgetTransformByMonth,
  useGetDefaultBirthdayWidgetTransform,
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
import { SliderControl } from './SliderControl';
import { ColorControl } from './ColorControl';
import { IconButton } from '@/shared/ui/common';
import { ResetIcon, UpdateIcon } from '@radix-ui/react-icons';
import { SaveIcon } from 'lucide-react';
import { MOCK_BIRTHDAYS } from '../lib/mockBirthdays';
import * as Switch from '@radix-ui/react-switch';
import { TooltipWrapper } from '@/shared/ui';

export function BirthdayWidgetTransformSettings() {
  const currentMonth = new Date().getMonth() + 1;
  const [month, setMonth] = useState(currentMonth);
  const [isHalfSetBirthdays, setHalfSetBirthdays] = useState(true);

  const { data: transformData, isLoading: transformIsLoading } =
    useGetBirthdayWidgetTransformByMonth(month);
  const { data: defaultTransform } = useGetDefaultBirthdayWidgetTransform();
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
    if (defaultTransform) {
      const defaultTransformWithMonth = {
        ...defaultTransform,
        month,
      };
      setLocalTransform(defaultTransformWithMonth);
    }
  };

  const handleRollbackChanges = () => {
    if (transformData) {
      setLocalTransform(transformData);
    }
  };

  const getPreviewBirthdays = () => {
    if (!isHalfSetBirthdays) return MOCK_BIRTHDAYS;

    const halfIndex = Math.floor(MOCK_BIRTHDAYS.length / 2);
    return MOCK_BIRTHDAYS.slice(
      0,
      isHalfSetBirthdays ? halfIndex : MOCK_BIRTHDAYS.length,
    );
  };

  useEffect(() => {
    if (transformData) setLocalTransform(transformData);
  }, [transformData]);

  if (transformIsLoading || backgroundIsLoading || !localTransform) {
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
            birthdays={getPreviewBirthdays()}
          />
        </div>

        <div className="grid w-full grid-cols-2 gap-x-4 gap-y-3">
          <SliderControl
            label="Ширина блока (в %)"
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
            label="Высота блока (в %)"
            value={localTransform.height}
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
            label="Расположение по Х (в %)"
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
            label="Расположение по Y (в %)"
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
            label="Поворот вокруг X (в град)"
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
            label="Поворот вокруг Y (в град)"
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
            label="Поворот вокруг Z (в град)"
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
            label="Размытие(блюр) тени (в px)"
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

          <div className="flex flex-row items-center justify-center gap-6">
            <TooltipWrapper
              tooltip={`Показывать ${isHalfSetBirthdays ? 'весь список' : 'половину списка'}`}
            >
              <div className="flex items-center">
                <Switch.Root
                  checked={isHalfSetBirthdays ?? false}
                  onCheckedChange={(checked) => setHalfSetBirthdays(checked)}
                  className="relative h-5 w-10 shrink-0 cursor-pointer rounded-full border border-(--border) transition-colors data-[state=checked]:bg-(--button-bg)"
                >
                  <Switch.Thumb className="block h-4 w-4 translate-x-[1px] rounded-full bg-(--text) transition-transform data-[state=checked]:translate-x-[21px]" />
                </Switch.Root>
              </div>
            </TooltipWrapper>

            <IconButton
              onClick={handleRollbackChanges}
              tooltip="Отменить изменения"
              ariaLabel="Отменить изменения"
              icon={<ResetIcon className="h-5 w-5 cursor-pointer" />}
            />

            <IconButton
              onClick={handleReset}
              disabled={isPending}
              tooltip="Сбросить настройки"
              ariaLabel="Сбросить настройки"
              icon={<UpdateIcon className="h-5 w-5 cursor-pointer" />}
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
      </div>
    </div>
  );
}
