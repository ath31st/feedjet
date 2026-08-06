/** biome-ignore-all lint/a11y: disable all a11y rules */
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { CommonDialog, IconButton } from '@/shared/ui/common';

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
      <CommonDialog.Header
        className="mb-0 px-6 py-4"
        title={title}
        actions={
          <IconButton
            icon={<X className="h-5 w-5 cursor-pointer" />}
            onClick={onClose}
          />
        }
      />

      <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
    </CommonDialog>
  );
}
