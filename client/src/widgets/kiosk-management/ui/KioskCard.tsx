import type { Kiosk } from '@/entities/kiosk';
import type { ReactNode } from 'react';

interface KioskCardProps {
  kiosk: Kiosk;
  actions?: ReactNode;
}

export function KioskCard({ kiosk, actions }: KioskCardProps) {
  return (
    <div
      className={`rounded-lg border ${kiosk.isActive ? 'border-(--border)' : 'border-(--border-disabled)'} p-3`}
    >
      <div className="mb-2 flex items-start justify-between">
        <h3
          className={`font-semibold text-lg ${kiosk.isActive ? '' : 'text-(--meta-text)'}`}
        >
          {kiosk.name}
        </h3>

        <div className="flex items-center gap-2">{actions}</div>
      </div>

      <div className="text-(--card-text) text-sm">
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
      </div>
    </div>
  );
}
