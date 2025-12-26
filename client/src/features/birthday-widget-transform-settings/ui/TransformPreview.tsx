import type { Birthday } from '@/entities/birthday';
import type { BirthdayWidgetTransform } from '@/entities/birthday-widget-transform';

interface TransformPreviewProps {
  backgroundUrl: string | null;
  transformData: BirthdayWidgetTransform;
  birthdays: Birthday[];
}

export function TransformPreview({
  backgroundUrl,
  transformData,
  birthdays,
}: TransformPreviewProps) {
  const {
    width,
    height,
    posX,
    posY,
    fontScale,
    rotateZ,
    rotateX,
    rotateY,
    lineGap,
  } = transformData;

  return (
    <div
      className="relative h-[360px] w-[640px] overflow-hidden rounded-lg border border-(--border) bg-neutral-900"
      style={{ perspective: '900px' }}
    >
      {backgroundUrl ? (
        <img
          src={backgroundUrl}
          alt="Background preview"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-(--without-theme) text-xs">
          background preview
        </div>
      )}

      <div
        className="absolute border-(--without-theme) border-2 border-dashed text-(--without-theme)"
        style={{
          left: `${posX}%`,
          top: `${posY}%`,
          width: `${width}%`,
          height: `${height}%`,
          transform: `
            translate(-50%, -50%)
            rotateZ(${rotateZ}deg)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
          `,
          transformStyle: 'preserve-3d',
          fontSize: `${fontScale}%`,
          textShadow: '0 2px 6px rgba(0,0,0,0.6)',
          lineHeight: `${lineGap}%`,
        }}
      >
        <div className="flex h-full w-full flex-col">
          {birthdays.map((birthday) => (
            <div
              key={birthday.id}
              className="flex w-full items-center justify-between whitespace-nowrap"
            >
              <span className="font-semibold">{birthday.fullName}</span>

              <span>
                {new Date(birthday.birthDate).toLocaleDateString('ru-RU', {
                  day: '2-digit',
                  month: 'long',
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
