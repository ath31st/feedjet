import type { Integration } from '@/entities/integration';
import { IntegrationConfigInfo } from './IntegrationConfigInfo';
import { integrationFull } from '@/entities/integration';
import {
  DeviceScreenOffAction,
  DeviceScreenOnAction,
} from '@/features/device-screen-control';
import type { ScreenState } from '@/entities/device-control';
import { ScreenStateValue } from '@/entities/device-control';
import { CommonButton } from '@/shared/ui/common';
import { Pencil, Trash2 } from 'lucide-react';
import { CardField, CardTitle, EntityCard } from '@/shared/ui';

interface IntegrationCardProps {
  integration: Integration;
  screenState?: ScreenState;
  onDelete: (id: number) => void;
  onEdit: (integration: Integration) => void;
}

export function IntegrationCard({
  integration,
  screenState,
  onDelete,
  onEdit,
}: IntegrationCardProps) {
  const typeLabel =
    integrationFull.find((i) => i.type === integration.type)?.label ??
    integration.type;

  return (
    <EntityCard
      controls={
        <>
          <DeviceScreenOnAction ip={integration.ip} />
          <DeviceScreenOffAction ip={integration.ip} />
        </>
      }
      actions={
        <>
          <CommonButton
            onClick={() => onEdit(integration)}
            type="button"
            tooltip="Редактировать интеграцию"
          >
            <Pencil size={15} />
          </CommonButton>

          <CommonButton
            type="button"
            onClick={() => onDelete(integration.id)}
            tooltip="Удалить интеграцию"
          >
            <Trash2 size={15} />
          </CommonButton>
        </>
      }
    >
      <CardTitle>{typeLabel}</CardTitle>

      <CardField label="Адрес">
        {integration.ip}:{integration.port}
      </CardField>

      {integration.description && (
        <CardField label="Описание">{integration.description}</CardField>
      )}

      <CardField label="Конфиг">
        <IntegrationConfigInfo integration={integration} />
      </CardField>

      <CardField label="Статус">
        {integration.isActive ? 'Активен' : 'Неактивен'}
      </CardField>

      <CardField label="Экран устройства">
        <ScreenStateValue state={screenState} />
      </CardField>
    </EntityCard>
  );
}
