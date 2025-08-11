import { useEffect, useState } from 'react';

export function BottomContent() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const weatherForecast = [
    { time: '12:00', temp: '+23°C', icon: '☀️' },
    { time: '13:00', temp: '+24°C', icon: '🌤️' },
    { time: '14:00', temp: '+22°C', icon: '⛅' },
  ];

  return (
    <div className="flex h-1/7 border-[var(--border)] border-t-2 px-4">
      <div className="flex flex-1 flex-col items-center justify-center font-bold text-8xl tracking-wide">
        <div>
          {hours}:{minutes}
        </div>
        <div className="text-3xl text-[var(--meta-text)]">{seconds}</div>
      </div>
      <div className="flex w-2/3 flex-col items-center justify-center gap-4 text-center text-6xl">
        <div className="text-4xl text-[var(--meta-text)]">
          Погода в Lorem Ipsum:
        </div>
        <div className="flex flex-col text-4xl text-[var(--meta-text)]">
          {weatherForecast.map(({ time, temp, icon }) => (
            <div key={time} className="flex gap-4 text-[var(--card-text)]">
              <span>{time}</span>
              <span>{temp}</span>
              <span>{icon}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
