import { useGetAllBirthdays } from '@/entities/birthday';
import { LoadingThreeDotsJumping } from '@/shared/ui';
import { BirthdayCard } from './BirthdayCard';

export function BirthdayList() {
  const { isLoading, data: birthdays } = useGetAllBirthdays();

  if (isLoading) return <LoadingThreeDotsJumping />;
  if (!birthdays?.length) return <p>В базе данных нет дней рождения</p>;

  return (
    <div className="flex w-full flex-col gap-4">
      {birthdays.map((birthday) => (
        <BirthdayCard key={birthday.id} birthday={birthday} />
      ))}
    </div>
  );
}
