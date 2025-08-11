import { useEffect, useState } from 'react';

export function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  return (
    <div className="flex flex-1 flex-col items-center justify-center font-bold text-8xl tracking-wide">
      <div>
        {hours}:{minutes}
      </div>
      <div className="text-3xl text-[var(--meta-text)]">{seconds}</div>
    </div>
  );
}
