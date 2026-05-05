import { useTickerConfigStore } from '@/entities/ticker-config';
import { TickerViewer } from '@/features/ticker-viewer';

interface TickerRuntimeProps {
  rotate: number;
}

export function TickerRuntime({ rotate }: TickerRuntimeProps) {
  const config = useTickerConfigStore((s) => s.tickerConfig);

  if (!config?.isActive || !config.text) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-50">
      <TickerViewer rotate={rotate} config={config} />
    </div>
  );
}
