import eagleUrl from '@/shared/assets/digital_eagle.svg';

interface BirthdayGreetingProps {
  isEffectiveXl?: boolean;
  companyName: string;
}

export function BirthdayGreeting({
  isEffectiveXl,
  companyName,
}: BirthdayGreetingProps) {
  const fontSizeXl = isEffectiveXl ? 5 : 3;
  const titleFontSize = isEffectiveXl ? 6 : 4;
  const topOffset = isEffectiveXl ? 60 : 100;

  return (
    <div
      className={`flex w-full flex-col items-center justify-center text-${fontSizeXl}xl`}
    >
      <div
        className="absolute flex flex-row items-center justify-center gap-10"
        style={{ top: `${topOffset}px` }}
      >
        <img
          src={eagleUrl}
          alt="Eagle"
          className="h-full w-1/10 object-contain"
          style={{ filter: 'drop-shadow(0 0 6px var(--border))' }}
        />
        <h1 className={`whitespace-nowrap font-bold text-${titleFontSize}xl`}>
          {companyName.toUpperCase()}
        </h1>
      </div>
      <p className="whitespace-nowrap font-semibold">
        Уважаемые коллеги! Дорогие друзья!
      </p>
      <p className="whitespace-nowrap">
        От лица коллектива поздравляем вас с днем рождения!
      </p>
    </div>
  );
}
