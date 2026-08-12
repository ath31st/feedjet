/** biome-ignore-all lint/a11y: dialog controls */
import { cn } from '@/shared/lib';
import * as Dialog from '@radix-ui/react-dialog';
import type { ReactNode } from 'react';

const contentSizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-6xl',
} as const;

type CommonDialogSize = keyof typeof contentSizes;

interface CommonDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  size?: CommonDialogSize;
  contentClassName?: string;
  children: ReactNode;
}

interface CommonDialogHeaderProps {
  icon?: ReactNode;
  iconVariant?: 'boxed' | 'inline';
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

interface CommonDialogSectionProps {
  className?: string;
  children: ReactNode;
}

function CommonDialogRoot({
  open,
  onOpenChange,
  onClose,
  size = 'md',
  contentClassName = '',
  children,
}: CommonDialogProps) {
  const handleOpenChange = (next: boolean) => {
    onOpenChange?.(next);
    if (!next) onClose?.();
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs" />

        <Dialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 z-51 w-full -translate-x-1/2 -translate-y-1/2 rounded-lg border border-(--border)/40 bg-(--card-bg) p-5 shadow-xl',
            contentSizes[size],
            contentClassName,
          )}
        >
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CommonDialogHeader({
  icon,
  iconVariant = 'boxed',
  title,
  description,
  actions,
  className = '',
}: CommonDialogHeaderProps) {
  return (
    <div
      className={cn('mb-4 flex items-start justify-between gap-3', className)}
    >
      <div className="flex items-start gap-3">
        {icon != null &&
          (iconVariant === 'boxed' ? (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-(--border) text-(--category-text)">
              {icon}
            </div>
          ) : (
            <div className="mt-0.5 shrink-0 text-(--text-secondary)">
              {icon}
            </div>
          ))}
        <div>
          <Dialog.Title className="font-semibold text-base">
            {title}
          </Dialog.Title>
          {description != null ? (
            <Dialog.Description className="mt-0.5 text-(--meta-text) text-sm">
              {description}
            </Dialog.Description>
          ) : (
            <Dialog.Description className="sr-only">{title}</Dialog.Description>
          )}
        </div>
      </div>
      {actions}
    </div>
  );
}

function CommonDialogBody({
  className = '',
  children,
}: CommonDialogSectionProps) {
  return <div className={className}>{children}</div>;
}

function CommonDialogFooter({
  className = '',
  children,
}: CommonDialogSectionProps) {
  return (
    <div className={cn('mt-5 flex justify-end gap-2', className)}>
      {children}
    </div>
  );
}

function CommonDialogHiddenLabel({
  title,
  description,
}: {
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <>
      <Dialog.Title className="sr-only">{title}</Dialog.Title>
      <Dialog.Description className="sr-only">
        {description ?? title}
      </Dialog.Description>
    </>
  );
}

export const CommonDialog = Object.assign(CommonDialogRoot, {
  Header: CommonDialogHeader,
  Body: CommonDialogBody,
  Footer: CommonDialogFooter,
  HiddenLabel: CommonDialogHiddenLabel,
});
