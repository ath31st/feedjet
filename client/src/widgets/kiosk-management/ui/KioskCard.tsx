import type { KioskWithHeartbeats } from '@/entities/kiosk';
import { CommonButton } from '@/shared/ui/common';
import { TrashIcon } from '@radix-ui/react-icons';
import type { ReactNode } from 'react';
import { HeartbeatCard } from './HeartbeatCard';
import { ConfirmActionDialog } from '@/shared/ui';
import {
  KioskScreenOffAction,
  KioskScreenOnAction,
} from '@/features/kiosk-screen-control';

interface KioskCardProps {
  kiosk: KioskWithHeartbeats;
  onDelete: (id: number) => void;
  actions?: ReactNode;
  hasIntegration: boolean;
}

export function KioskCard({
  kiosk,
  onDelete,
  actions,
  hasIntegration,
}: KioskCardProps) {
  return (
    <div
      className={`rounded-lg border ${kiosk.isActive ? 'border-(--border)' : 'border-(--border-disabled)'} p-4`}
    >
      <div className="mb-3 flex items-start justify-between">
        <h3
          className={`font-semibold text-lg ${kiosk.isActive ? '' : 'text-(--meta-text)'}`}
        >
          {kiosk.name}
        </h3>

        <div className="flex items-center gap-2">
          {kiosk.slug === 'default' ? null : (
            <ConfirmActionDialog
              title="Удалить киоск?"
              description={`Киоск «${kiosk.name}» будет удалён без возможности восстановления.`}
              confirmText="Удалить"
              onConfirm={() => onDelete(kiosk.id)}
              trigger={
                <CommonButton type="button" tooltip="Удалить киоск">
                  <TrashIcon />
                </CommonButton>
              }
            />
          )}

          {actions}
        </div>
      </div>

      <div className="space-y-2 text-(--card-text) text-sm">
        <div>
          <strong className="text-(--meta-text)">Slug:</strong> {kiosk.slug}
        </div>

        {kiosk.description && (
          <div>
            <strong className="text-(--meta-text)">Описание:</strong>{' '}
            {kiosk.description}
          </div>
        )}

        {kiosk.location && (
          <div>
            <strong className="text-(--meta-text)">Местоположение:</strong>{' '}
            {kiosk.location}
          </div>
        )}

        <div>
          <strong className="text-(--meta-text)">Статус:</strong>{' '}
          {kiosk.isActive ? 'Активен' : 'Неактивен'}
        </div>

        <div>
          <strong className="text-(--meta-text)">Создан:</strong>{' '}
          {new Date(kiosk.createdAt).toLocaleDateString()}
        </div>

        {kiosk.heartbeats.length > 0 && (
          <div>
            <strong className="text-(--meta-text)">
              Подключенные устройства:
            </strong>

            {kiosk.heartbeats.map((hb) => (
              <HeartbeatCard
                key={hb.ip}
                ip={hb.ip}
                lastHeartbeat={hb.lastHeartbeat}
                actions={
                  hasIntegration && (
                    <div className="ml-auto flex gap-2">
                      <KioskScreenOnAction kioskId={kiosk.id} kioskIp={hb.ip} />
                      <KioskScreenOffAction
                        kioskId={kiosk.id}
                        kioskIp={hb.ip}
                      />
                    </div>
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
