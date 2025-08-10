import eagleUrl from '@/shared/assets/digital_eagle.svg';

interface ScheduleHeaderProps {
  isEffectiveXl: boolean;
}

export function ScheduleHeader({ isEffectiveXl }: ScheduleHeaderProps) {
  return (
    <div
      className={`flex h-1/${isEffectiveXl ? 5 : 7} items-center justify-center p-4`}
    >
      <img
        src={eagleUrl}
        alt="Eagle"
        className="h-full w-1/2 object-contain"
        style={{ filter: 'drop-shadow(0 0 6px var(--border))' }}
      />
      <h1
        className={`w-${isEffectiveXl ? '4/5' : '2/3'} overflow-hidden text-center text-4xl uppercase`}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt
      </h1>
    </div>
  );
}
