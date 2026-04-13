import { useState } from 'react';
import { HelpDialog, HelpSectionButton } from '@/shared/ui';
import { useAdminHelp } from '@/features/admin-help-toggle';
import type { HelpItem } from '@/entities/help';

interface HelpPanelProps {
  helpItems: HelpItem[];
}

export function AdminHelpPanel({ helpItems }: HelpPanelProps) {
  const { enabled } = useAdminHelp();
  const [openDialog, setOpenDialog] = useState<number | null>(null);
  const isEmpty = helpItems.length === 0;

  if (!enabled || isEmpty) return null;

  return (
    <>
      <div className="absolute -top-6 right-50 bottom-0 w-0.5 bg-(--border)" />

      <div className="flex w-50 flex-col gap-3 px-5">
        {isEmpty ? (
          <p className="text-center text-(--text-secondary) text-xs">
            Справочная информация для этого раздела пока не добавлена.
          </p>
        ) : (
          helpItems.map((item, index) => (
            <div key={item.label}>
              <HelpSectionButton
                label={item.label}
                onClick={() => setOpenDialog(index)}
              />
              <HelpDialog
                title={item.title}
                content={item.content}
                open={openDialog === index}
                onClose={() => setOpenDialog(null)}
              />
            </div>
          ))
        )}
      </div>
    </>
  );
}
