import type { Kiosk } from '@/entities/kiosk';
import { CardField, CardTitle, EntityCard } from '@/shared/ui';
import type { ReactNode } from 'react';

interface KioskCardProps {
  kiosk: Kiosk;
  actions?: ReactNode;
}

export function KioskCard({ kiosk, actions }: KioskCardProps) {
  return (
    <EntityCard
      actions={actions}
      className={kiosk.isActive ? '' : 'border-(--border-disabled)'}
    >
      <CardTitle className={kiosk.isActive ? undefined : 'text-(--meta-text)'}>
        {kiosk.name}
      </CardTitle>

      <CardField label="Slug">{kiosk.slug}</CardField>

      {kiosk.description && (
        <CardField label="Описание">{kiosk.description}</CardField>
      )}

      {kiosk.location && (
        <CardField label="Местоположение">{kiosk.location}</CardField>
      )}

      <CardField label="Статус">
        {kiosk.isActive ? 'Активен' : 'Неактивен'}
      </CardField>

      <CardField label="Создан">
        {new Date(kiosk.createdAt).toLocaleDateString()}
      </CardField>
    </EntityCard>
  );
}
