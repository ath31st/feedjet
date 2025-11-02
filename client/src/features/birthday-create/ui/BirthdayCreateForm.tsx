import { CommonButton } from '@/shared/ui/common';
import { useCreateBirthdayForm } from '../model/useCreateBirthdayForm';
import { useCreateBirthday } from '@/entities/birthday';
import { PlusIcon } from '@radix-ui/react-icons';

export function BirthdayCreateForm() {
  const { mutate: onCreate, isPending } = useCreateBirthday();
  const { formData, handleChange, handleSubmit } =
    useCreateBirthdayForm(onCreate);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="ФИО"
        value={formData.fullName}
        onChange={(e) => handleChange('fullName', e.target.value)}
        className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
        required
      />

      <input
        type="text"
        placeholder="Департамент"
        value={formData.department || ''}
        onChange={(e) => handleChange('department', e.target.value)}
        className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
      />

      <div className="flex flex-row gap-2">
        <input
          type="date"
          value={formData.birthDate.toISOString().split('T')[0]}
          onChange={(e) => handleChange('birthDate', new Date(e.target.value))}
          className="flex-1 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--border)]"
          required
        />

        <CommonButton type="submit" disabled={isPending}>
          <PlusIcon />
        </CommonButton>
      </div>
    </form>
  );
}
