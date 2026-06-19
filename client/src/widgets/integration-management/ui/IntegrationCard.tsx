import type { Integration } from '@/entities/integration';
import { IntegrationConfigInfo } from './IntegrationConfigInfo';
import { integrationFull } from '@/entities/integration';
import {
  KioskScreenOffAction,
  KioskScreenOnAction,
} from '@/features/kiosk-screen-control';
import { IconButton } from '@/shared/ui/common';
import { Trash2 } from 'lucide-react';
import { ReloadKioskPageButton } from '@/features/reload-kiosk';

interface IntegrationCardProps {
  integration: Integration;

  onDelete: (id: number) => void;
}

export function IntegrationCard({
  integration,
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

        <IconButton
          onClick={() => onDelete(integration.id)}
          icon={<Trash2 className="h-4 w-4" />}
        />
      </div>
    </div>
  );
}
