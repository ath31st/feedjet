import { SettingsCard } from './SettingsCard';
import { Spinner } from './loading';

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
  const isLoading = message.includes('Загрузка');

  return (
    <SettingsCard title={title} className={className}>
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        {isLoading ? <Spinner size="lg" /> : <div className="text-2xl">📺</div>}
        <div>{message}</div>
      </div>
    </SettingsCard>
  );
}
