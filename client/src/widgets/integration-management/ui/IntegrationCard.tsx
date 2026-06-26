import type { Integration } from '@/entities/integration';
import { IntegrationConfigInfo } from './IntegrationConfigInfo';
import { integrationFull } from '@/entities/integration';
import {
  DeviceScreenOffAction,
  DeviceScreenOnAction,
} from '@/features/device-screen-control';
import { CommonButton } from '@/shared/ui/common';
import { Trash2 } from 'lucide-react';
import { Pencil2Icon } from '@radix-ui/react-icons';

interface IntegrationCardProps {
  integration: Integration;
  onDelete: (id: number) => void;
  onEdit: (integration: Integration) => void;
}

export function IntegrationCard({
  integration,
  onDelete,
  onEdit,
}: IntegrationCardProps) {
  const typeLabel =
    integrationFull.find((i) => i.type === integration.type)?.label ??
    integration.type;

  return (
    <div className="flex items-start justify-between rounded-lg border border-(--border) bg-(--card-bg) p-3">
      <div className="min-w-0 flex-1">
        <div className="mb-2 font-semibold">{typeLabel}</div>

        <div className="text-sm">
          <strong className="text-(--meta-text)">Адрес:</strong>{' '}
          {integration.ip}:{integration.port}
        </div>

        {integration.description && (
          <div className="text-sm">
            <strong className="text-(--meta-text)">Описание:</strong>{' '}
            {integration.description}
          </div>
        )}

        <div className="text-sm">
          <strong className="text-(--meta-text)">Конфиг:</strong>{' '}
          <IntegrationConfigInfo integration={integration} />
        </div>

        <div className="text-sm">
          <strong className="text-(--meta-text)">Статус:</strong>{' '}
          {integration.isActive ? 'Активен' : 'Неактивен'}
        </div>
      </div>

      <div className="mr-4 ml-auto flex gap-2">
        <DeviceScreenOnAction ip={integration.ip} />
        <DeviceScreenOffAction ip={integration.ip} />
      </div>

      <div className="ml-auto flex gap-2">
        <CommonButton
          onClick={() => onEdit(integration)}
          type="button"
          tooltip="Редактировать интеграцию"
        >
          <Pencil2Icon />
        </CommonButton>

        <CommonButton
          type="button"
          onClick={() => onDelete(integration.id)}
          tooltip="Удалить интеграцию"
        >
          <Trash2 className="h-4 w-4" />
        </CommonButton>
      </div>
    </div>
  );
}
