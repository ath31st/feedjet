import type { Kiosk } from '@/entities/kiosk';
import { CommonButton } from '@/shared/ui/common/CommonButton';
import { TrashIcon } from '@radix-ui/react-icons';
import type { ReactNode } from 'react';

interface KioskCardProps {
  kiosk: Omit<Kiosk, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
  };
  onDelete: (id: number) => void;
  actions?: ReactNode;
}

export function KioskCard({ kiosk, onDelete, actions }: KioskCardProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] p-4">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="font-semibold text-lg">{kiosk.name}</h3>

        <div className="flex items-center gap-2">
          <CommonButton type="button" onClick={() => onDelete(kiosk.id)}>
            <TrashIcon />
          </CommonButton>

          {actions}
        </div>
      </div>

      <div className="space-y-2 text-[var(--card-text)] text-sm">
        <div>
          <strong>Slug:</strong> {kiosk.slug}
        </div>

        <div>
          <strong>Описание:</strong> {kiosk.description}
        </div>

        <div>
          <strong>Местоположение:</strong> {kiosk.location}
        </div>

        <div>
          <strong>Статус:</strong> {kiosk.isActive ? 'Активен' : 'Неактивен'}
        </div>

        <div>
          <strong>Создан:</strong>{' '}
          {new Date(kiosk.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
