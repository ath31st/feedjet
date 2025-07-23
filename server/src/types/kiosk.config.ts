export interface KioskConfig {
  id: number;
  cellsPerPage: number;
  theme: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewKioskConfig {
  cellsPerPage: number;
  theme: string;
}

export interface UpdateKioskConfig {
  cellsPerPage?: number;
  theme?: string;
}
