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

  return (
    <div
      className={`flex w-full flex-col items-center justify-center gap-6 text-${fontSizeXl}xl`}
    >
      <div className="flex flex-row items-center justify-center gap-10">
        <img
          src={eagleUrl}
          alt="Eagle"
          className="h-full w-1/10 object-contain"
          style={{
            transform: 'scaleX(-1)',
            filter:
              'drop-shadow(0 0 4px var(--border)) drop-shadow(0 0 10px var(--border)) brightness(1.2)',
          }}
        />
        <h1
          className={`whitespace-nowrap font-bold text-${titleFontSize}xl`}
          style={{ textShadow: 'var(--text-shadow)' }}
        >
          {companyName.toUpperCase()}
        </h1>
        <img
          src={eagleUrl}
          alt="Eagle"
          className="h-full w-1/10 object-contain"
          style={{
            filter:
              'drop-shadow(0 0 4px var(--border)) drop-shadow(0 0 10px var(--border)) brightness(1.2)',
          }}
        />
      </div>
      <div className="flex flex-col items-center whitespace-nowrap text-shadow-[var(--text-shadow)]">
        <p>Уважаемые коллеги! Дорогие друзья!</p>
        <p>От лица коллектива поздравляем вас с днем рождения!</p>
      </div>
    </div>
  );
}
