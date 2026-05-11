/** biome-ignore-all lint/a11y: disable all a11y rules */
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { IconButton } from '@/shared/ui/common';

interface ScenarioModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const widths = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-6xl',
};

export function ScenarioModal({
  open,
  onClose,
  title,
  children,
  size = 'md',
}: ScenarioModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`flex h-170 w-full flex-col rounded-lg bg-(--card-bg) shadow-2xl ${widths[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="font-semibold text-lg">{title}</div>
          <IconButton
            icon={<X className="h-5 w-5 cursor-pointer" />}
            onClick={onClose}
          />
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
