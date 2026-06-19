import type { Integration, UpdateIntegration } from '@/entities/integration';
import { IntegrationConfigInfo } from './IntegrationConfigInfo';
import { integrationFull } from '@/entities/integration';
import {
  KioskScreenOffAction,
  KioskScreenOnAction,
} from '@/features/kiosk-screen-control';
import { CommonButton } from '@/shared/ui/common';
import { Trash2 } from 'lucide-react';
import { ReloadKioskPageButton } from '@/features/reload-kiosk';
import { Pencil2Icon } from '@radix-ui/react-icons';
import { IntegrationUpdateDialog } from '@/features/integration-update';

interface IntegrationCardProps {
  integration: Integration;
  onDelete: (id: number) => void;

  editIntegration: Integration | null;
  setEditIntegration: (i: Integration | null) => void;

  onUpdate: (data: UpdateIntegration) => void;
}

export function IntegrationCard({
  integration,
  editIntegration,
  setEditIntegration,
  onUpdate,
  onDelete,
}: IntegrationCardProps) {
  const typeLabel =
    integrationFull.find((i) => i.type === integration.type)?.label ??
    integration.type;

  return (
    <div className="flex justify-between rounded-lg border border-(--border) bg-(--card-bg) p-3">
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-(--text-primary)">{typeLabel}</div>

        <div className="text-(--text-meta) text-sm">
          {integration.host}:{integration.port}
        </div>

        {integration.description && (
          <div className="mt-1 text-sm">{integration.description}</div>
        )}

        <div className="mt-2 text-sm">
          <IntegrationConfigInfo integration={integration} />
        </div>

        <div className="mt-2 text-xs">
          {integration.isActive ? 'Активна' : 'Отключена'}
        </div>
      </div>

      <div className="ml-auto flex gap-2">
        <KioskScreenOnAction kioskId={0} kioskIp={'127.0.0.1'} />
        <KioskScreenOffAction kioskId={0} kioskIp={'127.0.0.1'} />

        <ReloadKioskPageButton kioskId={0} />

        <CommonButton
          onClick={() => setEditIntegration(integration)}
          type="button"
          tooltip="Редактировать интеграцию"
        >
          <Pencil2Icon />
        </CommonButton>

        <CommonButton type="button" onClick={() => onDelete(integration.id)}>
          <Trash2 className="h-4 w-4" />
        </CommonButton>
      </div>

      {editIntegration?.id === integration.id && (
        <IntegrationUpdateDialog
          integration={editIntegration}
          open={true}
          onClose={() => setEditIntegration(null)}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}
