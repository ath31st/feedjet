import { useEffect, useState } from 'react';
interface DigitalClockProps {
  fontXlSize: number;
}
export function DigitalClock({ fontXlSize }: DigitalClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  return (
    <div
      className={`flex flex-1 flex-col items-center justify-center font-bold text-${fontXlSize}xl tracking-wide`}
    >
      <div>
        {hours}:{minutes}
      </div>
      <div className={`text-${fontXlSize - 2}xl text-[var(--meta-text)]`}>
        {seconds}
      </div>
    </div>
  );
}
