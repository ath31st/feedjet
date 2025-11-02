import { LoadingThreeDotsJumping } from '@/shared/ui';
import { BirthdayCard } from './BirthdayCard';
import { useBirthdayList } from '../model/useBirthdayList';

export function BirthdayList() {
  const { isLoading, birthdays, handleDelete } = useBirthdayList();

  if (isLoading) return <LoadingThreeDotsJumping />;
  if (!birthdays?.length) return <p>В базе данных нет дней рождения</p>;

  return (
    <div className="flex w-full flex-col gap-2">
      {birthdays.map((birthday) => (
        <BirthdayCard
          key={birthday.id}
          birthday={birthday}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
