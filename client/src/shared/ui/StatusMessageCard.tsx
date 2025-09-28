import { SettingsCard } from './SettingsCard';

interface StatusMessageCardProps {
  title: string;
  message: string;
  className?: string;
}

export function StatusMessageCard({
  title,
  message,
  className,
}: StatusMessageCardProps) {
  return (
    <SettingsCard title={title} className={className}>
      <div className="py-6 text-center">
        <div className="mb-2 text-2xl">
          {message.includes('Загрузка') ? '⏳' : '📺'}
        </div>
        <div>{message}</div>
      </div>
    </SettingsCard>
  );
}
