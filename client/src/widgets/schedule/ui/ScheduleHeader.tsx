import eagleUrl from '@/shared/assets/digital_eagle.svg';

interface ScheduleHeaderProps {
  isEffectiveXl: boolean;
  title?: string;
}

export function ScheduleHeader({ isEffectiveXl, title }: ScheduleHeaderProps) {
  return (
    <div
      className={`flex ${isEffectiveXl ? 'h-1/5' : 'h-1/7'} items-center justify-center px-18 py-4`}
    >
      <img
        src={eagleUrl}
        alt="Eagle"
        className="h-full w-1/2 object-contain"
        style={{ filter: 'drop-shadow(0 0 6px var(--border))' }}
      />
      <h1
        className={`w-${isEffectiveXl ? '4/5' : '2/3'} overflow-hidden text-center font-semibold text-4xl uppercase`}
      >
        {title ||
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt'}
      </h1>
    </div>
  );
}
