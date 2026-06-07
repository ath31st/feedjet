/** biome-ignore-all lint/a11y: disable all a11y rules */
import type { ScenarioItem } from '@/entities/scenario';
import { CommonSwitch, IconButton } from '@/shared/ui/common';
import { GripVertical, Trash2 } from 'lucide-react';
import { DurationInput } from '@/shared/ui/DurationInput';
import { Draggable } from '@hello-pangea/dnd';
import { useItemRow } from '../model/useItemRow';

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
  const { config, Icon, label } = useItemRow(item);

  return (
    <Draggable draggableId={String(item.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`mb-2 flex items-center gap-3 rounded-lg border border-(--border) p-3 transition-[background-color,border-color,box-shadow,opacity] ${
            isCurrentlyPlaying
              ? 'bg-(--border)/20 ring-(--border)/40 ring-1'
              : ''
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
              if (onPreview && config.canPreview) onPreview();
            }}
            className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-(--bg) text-(--accent) ${
              config.canPreview
                ? 'cursor-zoom-in transition-transform hover:scale-105'
                : 'cursor-default'
            }`}
            title={config.canPreview ? 'Открыть превью' : undefined}
          >
            {config.renderPreview?.(item) || <Icon size={28} />}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium text-sm">{label}</p>
              {isCurrentlyPlaying && (
                <span className="inline-flex items-center gap-1 rounded-full bg-(--border)/20 px-2 py-0.5 font-semibold text-[10px] uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-(--border)" />
                  online
                </span>
              )}
            </div>
            <p className="text-(--text-muted) text-xs capitalize">
              {config.getTypeName}
            </p>
          </div>

          {config.hasDuration && (
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
