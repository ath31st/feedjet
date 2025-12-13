import * as AlertDialog from '@radix-ui/react-alert-dialog';
import type { ReactNode } from 'react';
import { CommonButton } from '@/shared/ui/common';
import { CheckIcon, ResetIcon } from '@radix-ui/react-icons';

interface ConfirmActionDialogProps {
  trigger: ReactNode;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
}

export function ConfirmActionDialog({
  trigger,
  title,
  description,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  onConfirm,
}: ConfirmActionDialogProps) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

        <AlertDialog.Content className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 w-[350px] rounded-lg border border-(--border) bg-(--card-bg) p-4 shadow-xl">
          <AlertDialog.Title className="mb-2 font-semibold text-lg">
            {title}
          </AlertDialog.Title>

          {description && (
            <AlertDialog.Description className="mb-4 text-(--meta-text) text-sm">
              {description}
            </AlertDialog.Description>
          )}

          <div className="flex justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <CommonButton type="button" tooltip={cancelText}>
                <ResetIcon />
              </CommonButton>
            </AlertDialog.Cancel>

            <AlertDialog.Action asChild>
              <CommonButton
                type="button"
                tooltip={confirmText}
                onClick={onConfirm}
              >
                <CheckIcon />
              </CommonButton>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
