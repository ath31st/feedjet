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
  const titleFontSize = isEffectiveXl ? 6 : 3;

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex flex-row items-center justify-center gap-10">
        <img
          src={eagleUrl}
          alt="Eagle"
          className="h-full w-1/10 object-contain"
          style={{
            transform: 'scaleX(-1)',
            filter:
              'drop-shadow(0 0 0px var(--without-theme)) drop-shadow(0 0 10px var(--without-theme)) brightness(1.2)',
          }}
        />
        <h1
          className={`whitespace-nowrap font-bold text-(--without-theme) text-${titleFontSize}xl`}
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
              'drop-shadow(0 0 0px var(--without-theme)) drop-shadow(0 0 10px var(--without-theme)) brightness(1.2)',
          }}
        />
      </div>
      <div
        className={`flex flex-col items-center whitespace-nowrap text-shadow-[var(--text-shadow)] uppercase text-${fontSizeXl}xl`}
      >
        <p className="text-(--without-theme)">Поздравляет с днем рождения</p>
      </div>
    </div>
  );
}
