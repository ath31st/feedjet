import type { Organization as OrganizationApi } from '@shared/types/organization';
export type {
  NewOrganization,
  UpdateOrganization,
} from '@shared/types/organization';

export type Organization = Omit<OrganizationApi, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};
