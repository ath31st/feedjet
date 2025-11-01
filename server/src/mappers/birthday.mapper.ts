import type { BirthdayEncrypted, Birthday } from '@shared/types/birthdays.js';
import { decrypt } from '../utils/crypto.js';

export const birthdayMapper = {
  mapEncToDec(b: BirthdayEncrypted): Birthday {
    return {
      id: b.id,
      fullName: decrypt(b.fullNameEnc),
      department: b.departmentEnc ? decrypt(b.departmentEnc) : undefined,
      birthDate: b.birthDate,
    };
  },
};
