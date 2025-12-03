import type { Birthday } from '@/entities/birthday';

interface BirthdayCardProps {
  birthday: Birthday;
  fontSizeXl?: number;
  delay?: number;
  duration?: number;
}

export function BirthdayCard({
  birthday,
  fontSizeXl = 4,
  delay = 0,
  duration = 1,
}: BirthdayCardProps) {
  return (
    <div
      className={`w-full text-${fontSizeXl}xl flex justify-between text-(--without-theme)`}
      style={{ textShadow: 'var(--text-shadow)' }}
    >
      <span
        className="inline-block opacity-0"
        style={{
          animation: `slide-in-left ${duration}s ease-out forwards`,
          animationDelay: `${delay}s`,
          textShadow: 'var(--text-shadow)',
        }}
      >
        {birthday.fullName}
      </span>
      <span
        className="inline-block opacity-0"
        style={{
          animation: `slide-in-right ${duration}s ease-out forwards`,
          animationDelay: `${delay}s`,
          textShadow: 'var(--text-shadow)',
        }}
      >
        {new Date(birthday.birthDate).toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: 'long',
        })}
      </span>
    </div>
  );
}
