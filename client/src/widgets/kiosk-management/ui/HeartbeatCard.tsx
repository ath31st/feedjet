import { format } from 'date-fns';

interface HeartbeatCardProps {
  ip: string;
  lastHeartbeat: string;
}

export const HeartbeatCard = ({ ip, lastHeartbeat }: HeartbeatCardProps) => {
  const now = new Date();
  const heartbeatDate = new Date(lastHeartbeat);

  const diffMs = now.getTime() - heartbeatDate.getTime();
  const diffMin = diffMs / 1000 / 60;
  const diffHour = diffMs / 1000 / 60 / 60;

  let colorClass = 'text-red-500';

  if (diffMin <= 1) {
    colorClass = 'text-green-500';
  } else if (diffHour <= 1) {
    colorClass = 'text-orange-500';
  }

  return (
    <div className={`flex flex-row gap-6 text-sm ${colorClass}`}>
      <span>📺 {ip}</span>
      <span>💓 {format(heartbeatDate, 'dd.MM.yyyy HH:mm:ss')}</span>
    </div>
  );
};
