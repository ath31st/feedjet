// ScenarioPreviewPlayer.tsx

import { useCallback, useRef, useState } from 'react';
import { Maximize2, X } from 'lucide-react';

import { IconButton } from '@/shared/ui/common';

import { PlayerControls } from './PlayerControls';
import { ScaledIframe } from './ScaledIframe';

interface ScenarioPreviewPlayerProps {
  previewSrc: string;
  iframeKey: number;
  paused: boolean;
  setPaused: React.Dispatch<React.SetStateAction<boolean>>;
  activeItemsCount: number;
  totalDuration: number;
  effectiveKioskId: number;
  onReload: () => void;
}

export function ScenarioPreviewPlayer({
  previewSrc,
  iframeKey,
  paused,
  setPaused,
  activeItemsCount,
  totalDuration,
  effectiveKioskId,
  onReload,
}: ScenarioPreviewPlayerProps) {
  const [fullscreen, setFullscreen] = useState(false);

  const miniIframeRef = useRef<HTMLIFrameElement>(null);
  const fullIframeRef = useRef<HTMLIFrameElement>(null);

  const sendCmd = useCallback(
    (
      type: 'kiosk:next' | 'kiosk:prev' | 'kiosk:toggle',
      ref: React.RefObject<HTMLIFrameElement | null>,
    ) => {
      ref.current?.contentWindow?.postMessage({ type }, '*');

      if (type === 'kiosk:toggle') {
        setPaused((v) => !v);
      }
    },
    [setPaused],
  );

  const renderControls = (
    ref: React.RefObject<HTMLIFrameElement | null>,
    variant: 'mini' | 'fullscreen',
  ) => (
    <PlayerControls
      paused={paused}
      onPrev={() => sendCmd('kiosk:prev', ref)}
      onNext={() => sendCmd('kiosk:next', ref)}
      onToggle={() => sendCmd('kiosk:toggle', ref)}
      onReload={onReload}
      variant={variant}
    />
  );

  const renderIframe = (ref: React.RefObject<HTMLIFrameElement | null>) => (
    <ScaledIframe src={previewSrc} iframeKey={iframeKey} iframeRef={ref} />
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-black">
        <div className="flex flex-1 items-center justify-center overflow-hidden p-6">
          <div className="w-full max-w-[min(100vw-48px,calc((100vh-160px)*16/9))]">
            {renderIframe(fullIframeRef)}
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 p-4">
          {renderControls(fullIframeRef, 'fullscreen')}

          <IconButton
            onClick={() => setFullscreen(false)}
            ariaLabel="Закрыть"
            icon={<X size={20} />}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="w-full overflow-hidden rounded-lg border-(--border) border-4">
        {effectiveKioskId > 0 ? (
          renderIframe(miniIframeRef)
        ) : (
          <div className="flex aspect-video items-center justify-center text-white/40">
            <p className="text-xs">Выберите киоск</p>
          </div>
        )}
      </div>

      <div className="relative flex w-full items-center justify-center">
        {renderControls(miniIframeRef, 'mini')}
        <div className="absolute top-0 right-0">
          <IconButton
            icon={<Maximize2 size={18} />}
            onClick={() => setFullscreen(true)}
            tooltip="Развернуть киоск на весь экран"
          />
        </div>
      </div>

      <p className="text-center text-(--text-muted) text-sm">
        Slug киоска: <span className="font-mono">{previewSrc}</span> ·{' '}
        {activeItemsCount} активн. · цикл {Math.floor(totalDuration / 60)}:
        {String(totalDuration % 60).padStart(2, '0')}
      </p>
    </div>
  );
}
