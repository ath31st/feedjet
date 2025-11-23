import { useEffect, useState } from 'react';
import { geRemFromTailwindXl } from '../lib';
interface DigitalClockProps {
  fontXlSize: number;
}
export function DigitalClock({ fontXlSize }: DigitalClockProps) {
  const [time, setTime] = useState(new Date());
  const fontSize = `${geRemFromTailwindXl(fontXlSize)}rem`;

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  return (
    <div
      className="flex flex-1 flex-col items-center justify-center font-bold tracking-wide"
      style={{ fontSize }}
    >
      <div>
        {hours}:{minutes}
      </div>
      <div className="text-6xl text-[var(--meta-text)]">{seconds}</div>
    </div>
  );
}
