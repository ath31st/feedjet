interface BirthdayGreetingProps {
  fontSizeXl?: number;
  companyName?: string;
}

export function BirthdayGreeting({
  fontSizeXl = 6,
  companyName,
}: BirthdayGreetingProps) {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center text-${fontSizeXl}xl`}
    >
      <p className="whitespace-nowrap font-semibold">Уважаемые коллеги!</p>
      <p className="whitespace-nowrap font-semibold">Дорогие друзья!</p>
      <p className="whitespace-nowrap font-semibold">--поздравление--</p>
    </div>
  );
}
