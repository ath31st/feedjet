import {
  DeviceScreenOffAction,
  DeviceScreenOnAction,
} from '@/features/device-screen-control';
import { CommonButton } from '@/shared/ui/common';
import { Trash2, Copy } from 'lucide-react';
import { ReloadDevicePageButton } from '@/features/reload-device';
import type { Device } from '@/entities/device';
import copy from 'copy-to-clipboard';
import { toast } from 'sonner';
import { CardField, CardTitle, EntityCard } from '@/shared/ui';
import { fmtRelative, getRelativeColor } from '@/shared/lib';

interface DeviceCardProps {
  device: Device;
  onDelete: (id: string) => void;
}

const handleCopyIp = async (ip: string) => {
  const ok = await copy(ip);

  if (ok) {
    toast.success('IP скопирован');
  } else {
    toast.error('Не удалось скопировать IP');
  }
};

export function DeviceCard({ device, onDelete }: DeviceCardProps) {
  return (
    <EntityCard
      controls={
        <>
          {device.hasIntegration && (
            <>
              <DeviceScreenOnAction ip={device.ip} />
              <DeviceScreenOffAction ip={device.ip} />
            </>
          )}

          <ReloadDevicePageButton deviceId={device.deviceId} />
        </>
      }
      actions={
        <CommonButton
          type="button"
          onClick={() => onDelete(device.deviceId)}
          tooltip="Удалить устройство"
        >
          <Trash2 size={15} />
        </CommonButton>
      }
    >
      <div className="flex items-center gap-2">
        <CardTitle>{device.ip}</CardTitle>

        <CommonButton
          type="button"
          onClick={() => handleCopyIp(device.ip)}
          tooltip="Скопировать IP"
        >
          <Copy size={15} />
        </CommonButton>
      </div>

      <CardField label="Slug">{device.slug}</CardField>

      {device.platform && (
        <CardField label="Платформа">{device.platform}</CardField>
      )}

      <CardField label="User Agent">{device.userAgent}</CardField>

      <CardField label="Последняя активность">
        {new Date(device.lastSeenAt).toLocaleString()}
      </CardField>

      <CardField label="С момента">
        {new Date(device.firstSeenAt).toLocaleString()} (
        <span className={getRelativeColor(device.lastSeenAt)}>
          {fmtRelative(device.lastSeenAt)}
        </span>
        )
      </CardField>
    </EntityCard>
  );
}
