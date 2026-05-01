import { SliderControl } from '@/features/birthday-widget-transform-settings/ui/SliderControl';
import { useTickerConfigSettings } from '../model/useTickerConfigSettings';
import { ColorControl } from '@/features/birthday-widget-transform-settings/ui/ColorControl';
import { IconButton } from '@/shared/ui/common';
import { ResetIcon, UpdateIcon } from '@radix-ui/react-icons';
import { SaveIcon } from 'lucide-react';

interface TickerConfigSettingsProps {
  kioskId: number;
}

export function TickerConfigSettings({ kioskId }: TickerConfigSettingsProps) {
  const {
    isUpdating,
    isConfigLoading,
    localConfig,
    setLocalConfig,
    handleSave,
    handleReset,
    handleRollbackChanges,
  } = useTickerConfigSettings(kioskId);

  if (isConfigLoading || !localConfig) {
    return <div className="w-full text-(--meta-text) text-sm">Загрузка...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-6 2xl:flex-row">
        <div className="flex-1">
          {/* <TickerPreview tickerData={localConfig} /> */}
        </div>

        <div className="grid w-full grid-cols-2 gap-x-4 gap-y-3">
          <SliderControl
            label="Скорость (в пикселях в секунду)"
            value={localConfig.speedPxPerSec}
            min={0}
            max={100}
            step={1}
            onChange={(val) =>
              setLocalConfig((prev) =>
                prev ? { ...prev, speedPxPerSec: val } : prev,
              )
            }
          />

          <SliderControl
            label="Прозрачность фона (в %)"
            value={localConfig.backgroundOpacity}
            min={0}
            max={100}
            step={1}
            onChange={(val) =>
              setLocalConfig((prev) =>
                prev ? { ...prev, backgroundOpacity: val } : prev,
              )
            }
          />

          <SliderControl
            label="Высота (в пикселях)"
            value={localConfig.height}
            min={0}
            max={2000}
            step={1}
            onChange={(val) =>
              setLocalConfig((prev) => (prev ? { ...prev, height: val } : prev))
            }
          />

          <SliderControl
            label="Расположение по Y (в %)"
            value={localConfig.positionY}
            min={10}
            max={100}
            step={1}
            onChange={(val) =>
              setLocalConfig((prev) =>
                prev ? { ...prev, positionY: val } : prev,
              )
            }
          />

          <SliderControl
            label="Горизонтальный отступ (в пикселях)"
            value={localConfig.paddingX}
            min={0}
            max={200}
            step={1}
            onChange={(val) =>
              setLocalConfig((prev) =>
                prev ? { ...prev, paddingX: val } : prev,
              )
            }
          />

          <SliderControl
            label="Масштаб шрифта (в %)"
            value={localConfig.fontScale}
            min={50}
            max={300}
            step={1}
            onChange={(val) =>
              setLocalConfig((prev) =>
                prev ? { ...prev, fontScale: val } : prev,
              )
            }
          />

          <ColorControl
            label="Цвет текста"
            value={localConfig.textColor ?? '#ffffff'}
            onChange={(val) =>
              setLocalConfig((prev) =>
                prev ? { ...prev, textColor: val } : prev,
              )
            }
          />

          <ColorControl
            label="Цвет фона"
            value={localConfig.backgroundColor ?? '#000000'}
            onChange={(val) =>
              setLocalConfig((prev) =>
                prev ? { ...prev, backgroundColor: val } : prev,
              )
            }
          />

          <div className="flex flex-row items-center justify-center gap-6">
            <IconButton
              onClick={handleRollbackChanges}
              tooltip="Отменить изменения"
              ariaLabel="Отменить изменения"
              icon={<ResetIcon className="h-5 w-5 cursor-pointer" />}
            />

            <IconButton
              onClick={handleReset}
              disabled={isUpdating}
              tooltip="Сбросить настройки"
              ariaLabel="Сбросить настройки"
              icon={<UpdateIcon className="h-5 w-5 cursor-pointer" />}
            />

            <IconButton
              onClick={handleSave}
              disabled={isUpdating}
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
