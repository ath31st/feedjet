import type {
  IntegrationType,
  NewIntegration,
  UpdateIntegration,
} from '@shared/types/integration.js';
import type { DbType } from '../container.js';
import { encrypt } from '../utils/crypto.js';
import { createServiceLogger } from '../utils/pino.logger.js';
import { kioskIntegrationsTable } from '../db/schema.js';
import { and, eq } from 'drizzle-orm';
import { IntegrationError } from '../errors/integration.error.js';

export class IntegrationService {
  private readonly db: DbType;
  private readonly logger = createServiceLogger('integrationService');

  constructor(db: DbType) {
    this.db = db;
  }

  create(kioskId: number, input: NewIntegration) {
    this.logger.debug({ kioskId, input, fn: 'create' }, 'Creating integration');
    this.validate(input);

    try {
      const integration = this.db
        .insert(kioskIntegrationsTable)
        .values({
          kioskId: kioskId,
          type: input.type,
          url: input.url ?? null,
          login: input.login ?? null,
          passwordEnc: input.password && encrypt(input.password),
        })
        .returning()
        .get();

      this.logger.info(
        { kioskId, type: input.type, fn: 'create' },
        'Created integration',
      );

      return integration;
    } catch (error) {
      this.logger.error(
        { kioskId, type: input.type, fn: 'create' },
        'Error creating integration',
        error,
      );
      throw new IntegrationError(500, 'Error creating integration');
    }
  }

  update(kioskId: number, input: UpdateIntegration) {
    this.logger.debug({ kioskId, input, fn: 'update' }, 'Updating integration');
    this.validate(input);

    const updateData: Record<string, unknown> = {
      url: input.url,
      login: input.login,
    };

    if (input.password) {
      updateData.passwordEnc = encrypt(input.password);
    }

    try {
      const result = this.db
        .update(kioskIntegrationsTable)
        .set(updateData)
        .where(
          and(
            eq(kioskIntegrationsTable.kioskId, kioskId),
            eq(kioskIntegrationsTable.type, input.type),
          ),
        );

      this.logger.info(
        { kioskId, type: input.type, fn: 'update' },
        'Updated integration',
      );

      return result;
    } catch (error) {
      this.logger.error(
        { kioskId, type: input.type, fn: 'update' },
        'Error updating integration',
        error,
      );
      throw new IntegrationError(500, 'Error updating integration');
    }
  }

  delete(kioskId: number, type: IntegrationType) {
    this.logger.debug({ kioskId, type, fn: 'delete' }, 'Deleting integration');
    const result = this.db
      .delete(kioskIntegrationsTable)
      .where(
        and(
          eq(kioskIntegrationsTable.kioskId, kioskId),
          eq(kioskIntegrationsTable.type, type),
        ),
      );

    this.logger.info({ kioskId, type, fn: 'delete' }, 'Deleted integration');
    return result;
  }

  exists(kioskId: number, type: IntegrationType): boolean {
    this.logger.debug(
      { kioskId, type, fn: 'exists' },
      'Checking if integration exists',
    );

    const integration = this.db
      .select()
      .from(kioskIntegrationsTable)
      .where(
        and(
          eq(kioskIntegrationsTable.kioskId, kioskId),
          eq(kioskIntegrationsTable.type, type),
        ),
      )
      .get();

    return !!integration;
  }

  private validate(input: NewIntegration | UpdateIntegration) {
    if (input.type === 'fully_kiosk') {
      if (!input.password) {
        throw new IntegrationError(
          400,
          'Fully Kiosk requires url and password',
        );
      }
    }
  }
}
