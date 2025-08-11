interface WeatherForecastProps {
  locationTitle?: string;
}

export function WeatherForecast({ locationTitle }: WeatherForecastProps) {
  const weatherForecast = [
    { time: '12:00', temp: '+23°C', icon: '☀️' },
    { time: '13:00', temp: '+24°C', icon: '🌤️' },
    { time: '14:00', temp: '+22°C', icon: '⛅' },
  ];

  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-4">
      <div className="text-center text-4xl text-[var(--meta-text)]">
        Погода в {locationTitle || 'Lorem Ipsum'}:
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
  );
}
