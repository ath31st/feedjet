import { buildImageUrl, type AdminImageInfo } from '@/entities/image';
import { formatBytes, formatSecondsToTime } from '@/shared/lib';
import { RotationInterval, TooltipWrapper } from '@/shared/ui';
import { CommonSwitch, IconButton } from '@/shared/ui/common';
import {
  Cross1Icon,
  EyeOpenIcon,
  Pencil1Icon,
  TimerIcon,
  UpdateIcon,
} from '@radix-ui/react-icons';
import { useImageItem } from '../model/useImageItem';

interface ImageItemProps {
  item: AdminImageInfo;
  // biome-ignore lint/suspicious/noExplicitAny: type is absent for DND list
  drag: any;
  globalDuration: number;
  onRemove: (name: string) => void;
  onUpdateDuration: (name: string) => (val: number) => void;
  onUpdateActive: (name: string, active: boolean, duration: number) => void;
  onPreview: (img: AdminImageInfo) => void;
  isRemoving: boolean;
  isUpdatingActive: boolean;
}

export function ImageItem({
  item: i,
  drag,
  globalDuration,
  onRemove,
  onUpdateDuration,
  onUpdateActive,
  onPreview,
  isRemoving,
  isUpdatingActive,
}: ImageItemProps) {
  const { isManual, toggleManual } = useImageItem(
    i,
    globalDuration,
    onUpdateDuration,
  );

  return (
    <div
      ref={drag.ref}
      {...drag.draggableProps}
      {...drag.dragHandleProps}
      className={`flex cursor-grab items-center gap-2 rounded-lg border ${
        i.isActive ? 'border-(--border)' : 'border-(--border-disabled)'
      } p-1 ${drag.isDragging ? 'opacity-70 shadow-lg' : ''}`}
    >
      <img
        src={`${buildImageUrl(i.thumbnail)}?v=${i.mtime}`}
        alt=""
        className="w-30 rounded-lg object-contain"
      />

      <div className="flex w-full items-center justify-between p-1">
        <div className="flex w-full flex-col overflow-hidden text-(--meta-text) text-xs">
          <span className="truncate text-(--text) text-sm">{i.name}</span>

          <div className="flex w-[80%] flex-row items-center">
            <div className="flex flex-1 flex-col">
              <span>
                Разрешение: {i.width}x{i.height}px
              </span>
              <span>Формат: {i.format}</span>
            </div>

            <div className="flex flex-1 flex-col">
              <span>Размер: {formatBytes(i.size)}</span>
              <span>
                Дата загрузки: {new Date(i.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex flex-1">
              {isManual ? (
                <div className="w-1">
                  <RotationInterval
                    inputId={`interval-${i.fileName}`}
                    value={i.durationSeconds ?? globalDuration}
                    update={onUpdateDuration(i.fileName)}
                  />
                </div>
              ) : (
                <span>
                  Длительность: {formatSecondsToTime(i.durationSeconds ?? 0)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <CommonSwitch
            checked={i.isActive ?? false}
            disabled={isUpdatingActive}
            onCheckedChange={(checked) =>
              onUpdateActive(
                i.fileName,
                checked,
                i.durationSeconds ?? globalDuration,
              )
            }
          ></CommonSwitch>

          <TooltipWrapper
            tooltip={
              isManual
                ? 'Сбросить к глобальной длительности'
                : 'Установить индивидуальную длительность'
            }
          >
            <button
              type="button"
              onClick={toggleManual}
              className={`flex h-5 cursor-pointer items-center gap-1 rounded-lg border px-1.5 transition-colors ${
                isManual
                  ? 'border-(--button-bg) bg-(--button-bg) text-(--text)'
                  : 'border-(--border) text-(--meta-text) hover:bg-(--border)'
              }`}
            >
              <TimerIcon className="h-4 w-4" />
              {isManual ? (
                <UpdateIcon className="h-4 w-4" />
              ) : (
                <Pencil1Icon className="h-4 w-4" />
              )}
            </button>
          </TooltipWrapper>

          <IconButton
            onClick={() => onPreview(i)}
            tooltip="Открыть изображение"
            icon={<EyeOpenIcon className="h-4 w-4 cursor-pointer" />}
          />

          <IconButton
            disabled={isRemoving}
            onClick={() => onRemove(i.fileName)}
            tooltip="Удалить изображение"
            icon={<Cross1Icon className="h-4 w-4" />}
          />
        </div>
      </div>
    </div>
  );
}
