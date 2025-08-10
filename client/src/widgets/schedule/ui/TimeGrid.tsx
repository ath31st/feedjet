import { PlayIcon } from '@radix-ui/react-icons';

interface TimeGridProps {
  hours: string[];
  positionPercent: number;
}

export function TimeGrid({ hours, positionPercent }: TimeGridProps) {
  return (
    <div className="relative h-full w-full">
      <div
        className="-left-10 absolute z-20"
        style={{ top: `${Math.min(100, Math.max(0, positionPercent))}%` }}
      >
        <PlayIcon className="h-10 w-10" style={{ color: 'var(--text)' }} />
      </div>

      <div className="flex h-full flex-col">
        {hours.map((hour) => (
          <div
            key={hour}
            className="items-top flex flex-1 text-2xl"
            style={{ color: 'var(--meta-text)' }}
          >
            {hour}
          </div>
        ))}
      </div>
    </div>
  );
}
