import { useState } from 'react';
import { HelpDialog, HelpSectionButton } from '@/shared/ui';
import type { HelpItem } from '@/widgets/birthdays-management/ui/Help';

interface HelpPanelProps {
  helpItems: HelpItem[];
}

export function AdminHelpPanel({ helpItems }: HelpPanelProps) {
  const [openDialog, setOpenDialog] = useState<number | null>(null);

  if (!helpItems.length) {
    return (
      <div className="flex flex-col">
        <p className="w-50 px-5 text-center text-(--text-secondary) text-xs">
          Справочная информация для этого раздела пока не добавлена.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-50 flex-col gap-3 px-5">
      {helpItems.map((item, index) => (
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
      ))}
    </div>
  );
}
