import type { Integration } from '@shared/types/integration.js';
import type { InferSelectModel } from 'drizzle-orm';
import type { kioskIntegrationsTable } from '../db/schema.js';

type IntegrationRow = InferSelectModel<typeof kioskIntegrationsTable>;

export const integrationMapper = {
  fromEntity(row: IntegrationRow): Integration {
    return {
      kioskId: row.kioskId,
      type: row.type,
      description: row.description ?? undefined,
      login: row.login ?? undefined,
      passwordEnc: row.passwordEnc ?? undefined,
    };
  },

  fromEntities(rows: IntegrationRow[]): Integration[] {
    return rows.map((row) => this.fromEntity(row));
  },
} as const;
