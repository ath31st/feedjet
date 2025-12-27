import type { Birthday } from '@/entities/birthday';
import type { BirthdayWidgetTransform } from '@/entities/birthday-widget-transform';

interface BirthdayTransformViewProps {
  transformData: BirthdayWidgetTransform;
  birthdays: Birthday[];
  showDebugBorder?: boolean;
}

export function BirthdayTransformView({
  transformData,
  birthdays,
  showDebugBorder = false,
}: BirthdayTransformViewProps) {
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
    textColor,
    shadowBlur,
  } = transformData;

  return (
    <div
      className={`absolute flex flex-col ${
        showDebugBorder ? 'border-(--without-theme) border-2 border-dashed' : ''
      }`}
      style={{
        color: textColor,
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
        textShadow:
          shadowBlur === 0 ? 'none' : `2px 2px ${shadowBlur}px rgba(0,0,0,0.6)`,
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
  );
}
