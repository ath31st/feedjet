import { BirthdayCreateForm } from '@/features/birthday-create';
import { BirthdayFileUpload } from '@/features/birthday-file-upload';
import { SettingsCard } from '@/shared/ui/SettingsCard';

export function BirthdaysManagement() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-row gap-6">
        <SettingsCard
          title="Загрузка файла с днями рождения"
          className="w-full md:w-1/2"
        >
          <BirthdayFileUpload />
        </SettingsCard>
        <SettingsCard
          title="Добавление дня рождения"
          className="w-full md:w-1/2"
        >
          <BirthdayCreateForm />
        </SettingsCard>
      </div>
    </div>
  );
}
