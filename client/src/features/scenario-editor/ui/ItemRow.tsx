/** biome-ignore-all lint/a11y: disable all a11y rules */
import type { ScenarioItem } from '@/entities/scenario';
import { CommonSwitch, IconButton } from '@/shared/ui/common';
import { Info, Video, GripVertical, Trash2 } from 'lucide-react';
import { DurationInput } from './DurationInput';
import { Draggable } from '@hello-pangea/dnd';
import { SERVER_URL } from '@/shared/config';
import { WIDGET_ICONS, WIDGET_LABELS } from '@/entities/scenario';

export function ItemRow({
  item,
  index,
  isActive: isCurrentlyPlaying,
  onToggle,
  onDelete,
  onDurationChange,
  onClick,
  onPreview,
}: {
  item: ScenarioItem;
  index: number;
  isActive: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onDurationChange: (v: number) => void;
  onClick: () => void;
  onPreview?: () => void;
}) {
  const Icon =
    item.type === 'widget'
      ? (WIDGET_ICONS[item.widgetType ?? 'weather'] ?? Info)
      : item.type === 'image'
        ? Image
        : Video;
  const label =
    item.type === 'widget'
      ? WIDGET_LABELS[item.widgetType ?? 'weather']
      : item.type === 'image'
        ? (item.imageName ?? 'Изображение')
        : (item.videoName ?? 'Видео');

  return (
    <Draggable draggableId={String(item.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${
            isCurrentlyPlaying
              ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_0_1px_rgba(16,185,129,0.25)] ring-2 ring-emerald-500/40'
              : 'border-(--border) bg-(--surface)'
          } ${snapshot.isDragging ? 'opacity-80 shadow-xl' : ''} ${
            !item.isActive ? 'opacity-50' : ''
          }`}
          onClick={onClick}
        >
          <div
            {...provided.dragHandleProps}
            className="cursor-grab text-(--text-muted)"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical size={16} />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (
                onPreview &&
                (item.type === 'image' || item.type === 'video')
              ) {
                onPreview();
              }
            }}
            className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-(--bg) text-(--accent) ${item.type === 'image' || item.type === 'video' ? 'cursor-zoom-in transition-transform hover:scale-105' : 'cursor-default'}`}
            title={
              item.type === 'image' || item.type === 'video'
                ? 'Открыть превью'
                : undefined
            }
          >
            {item.type === 'image' && item.imageThumbnail ? (
              <img
                src={`${SERVER_URL}/images/${item.imageThumbnail}`}
                alt={label}
                className="h-full w-full object-cover"
              />
            ) : item.type === 'video' && item.videoFileName ? (
              <video
                src={`${SERVER_URL}/videos/${item.videoFileName}`}
                muted
                preload="metadata"
                className="h-full w-full object-cover"
              />
            ) : (
              <Icon size={18} />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium text-sm">{label}</p>
              {isCurrentlyPlaying && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 font-semibold text-[10px] text-emerald-400 uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  играет
                </span>
              )}
            </div>
            <p className="text-(--text-muted) text-xs capitalize">
              {item.type === 'widget'
                ? 'Виджет'
                : item.type === 'image'
                  ? 'Изображение'
                  : 'Видео'}
            </p>
          </div>

          {item.type !== 'video' && (
            <div onClick={(e) => e.stopPropagation()}>
              <DurationInput
                value={item.durationSeconds ?? 10}
                onChange={onDurationChange}
                min={1}
                max={3600}
              />
            </div>
          )}

          <div onClick={(e) => e.stopPropagation()}>
            <CommonSwitch checked={item.isActive} onCheckedChange={onToggle} />
          </div>

          <IconButton onClick={onDelete} icon={<Trash2 size={16} />} />
        </div>
      )}
    </Draggable>
  );
}
