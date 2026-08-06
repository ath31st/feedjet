/** biome-ignore-all lint/a11y: disable all a11y rules */
import type { ReactNode } from 'react';
import { CommonDialog } from '@/shared/ui/common';

interface ScenarioModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function ScenarioModal({
  open,
  onClose,
  title,
  children,
  size = 'md',
}: ScenarioModalProps) {
  return (
    <CommonDialog
      open={open}
      onClose={onClose}
      size={size}
      contentClassName="flex h-170 flex-col p-0"
    >
      <CommonDialog.Header className="mb-0 px-6 py-4" title={title} />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-5">
        {children}
      </div>
    </CommonDialog>
  );
}
