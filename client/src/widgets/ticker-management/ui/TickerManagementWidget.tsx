import { SettingsCard } from '@/shared/ui/SettingsCard';

export type TickerManagementWidgetProps = {
  kioskId: number;
};

export function TickerManagementWidget({
  kioskId,
}: TickerManagementWidgetProps) {
  return (
    <div className="flex w-full flex-col gap-6">
      <SettingsCard title="Настройки бегущей строки" className="w-full">
        <span>Not implemented {kioskId}</span>
      </SettingsCard>
    </div>
  );
}
