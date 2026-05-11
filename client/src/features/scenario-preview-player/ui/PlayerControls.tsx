/** biome-ignore-all lint/a11y: disable all a11y rules */
import { IconButton } from '@/shared/ui/common';
import { Pause, Play, RotateCw, SkipBack, SkipForward } from 'lucide-react';

interface PlayerControlsProps {
  paused: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggle: () => void;
  onReload: () => void;
  variant?: 'mini' | 'fullscreen';
}

export function PlayerControls({
  paused,
  onPrev,
  onNext,
  onToggle,
  onReload,
  variant = 'mini',
}: PlayerControlsProps) {
  const isFullscreen = variant === 'fullscreen';

  return (
    <div className="flex items-center gap-3">
      <IconButton
        onClick={onPrev}
        ariaLabel="Предыдущий"
        icon={<SkipBack size={isFullscreen ? 18 : 14} />}
      />
      <IconButton
        onClick={onToggle}
        ariaLabel={paused ? 'Воспроизвести' : 'Пауза'}
        icon={
          paused ? (
            <Play size={isFullscreen ? 22 : 18} />
          ) : (
            <Pause size={isFullscreen ? 22 : 18} />
          )
        }
      />
      <IconButton
        onClick={onNext}
        ariaLabel="Следующий"
        icon={<SkipForward size={isFullscreen ? 18 : 14} />}
      />
      <IconButton
        onClick={onReload}
        ariaLabel="Перезагрузить"
        icon={<RotateCw size={isFullscreen ? 16 : 12} />}
      />
    </div>
  );
}
