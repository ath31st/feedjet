export * from './api/useBirthday';
import type { Birthday as BirthdayApi } from '@shared/types/birthdays';
export type { NewBirthday } from '@shared/types/birthdays';

export type Birthday = Omit<BirthdayApi, 'birthDate'> & {
  birthDate: string;
};
