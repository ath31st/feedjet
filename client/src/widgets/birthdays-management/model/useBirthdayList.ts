import { useDeleteBirthday, useGetAllBirthdays } from '@/entities/birthday';

export function useBirthdayList() {
  const { isLoading, data: birthdays } = useGetAllBirthdays();
  const deleteBirthday = useDeleteBirthday();
  const handleDelete = (id: number) => {
    deleteBirthday.mutate({ id });
  };

  return {
    isLoading,
    birthdays,
    handleDelete,
  };
}
