export interface BirthdayEncrypted {
  id: number;
  fullNameEnc: string;
  departmentEnc: string | null;
  birthDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Birthday {
  id: number;
  fullName: string;
  department?: string;
  birthDate: Date;
}

export interface NewBirthday {
  fullName: string;
  department?: string;
  birthDate: Date;
}
