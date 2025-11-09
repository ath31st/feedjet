interface BirthdayGreetingProps {
  fontSizeXl?: number;
  companyName: string;
}

export function BirthdayGreeting({
  fontSizeXl = 6,
  companyName,
}: BirthdayGreetingProps) {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center text-${fontSizeXl}xl`}
    >
      <h1
        className={`absolute top-20 whitespace-nowrap font-bold text-${fontSizeXl + 1}xl`}
      >
        {companyName.toUpperCase()}
      </h1>
      <p className="whitespace-nowrap font-semibold">
        Уважаемые коллеги! Дорогие друзья!
      </p>
      <p className="whitespace-nowrap">
        От лица коллектива поздравляем вас с днем рождения!
      </p>
    </div>
  );
}
