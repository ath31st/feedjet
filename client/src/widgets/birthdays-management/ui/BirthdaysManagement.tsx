import { BirthdayCreateForm } from '@/features/birthday-create';
import { BirthdayFileUpload } from '@/features/birthday-file-upload';
import { SettingsCard } from '@/shared/ui/SettingsCard';
import { BirthdayList } from './BirthdayList';
import { BirthdayBackgrounds } from './BirthdayBackgrounds';

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

      <div className="w-full">
        <SettingsCard title="Фон" className="w-full">
          <BirthdayBackgrounds />
        </SettingsCard>
      </div>

      <div className="w-full">
        <SettingsCard title="Дни рождения" className="w-full">
          <BirthdayList />
        </SettingsCard>
      </div>
    </div>
  );
}
