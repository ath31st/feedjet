import {
  DeviceScreenOffAction,
  DeviceScreenOnAction,
} from '@/features/device-screen-control';
import { CommonButton } from '@/shared/ui/common';
import { Trash2 } from 'lucide-react';
import { ReloadDevicePageButton } from '@/features/reload-device';
import type { Device } from '@/entities/device';

interface DeviceCardProps {
  device: Device;
  onDelete: (id: string) => void;
}

export function DeviceCard({ device, onDelete }: DeviceCardProps) {
  return (
    <div className="flex items-start justify-between rounded-lg border border-(--border) bg-(--card-bg) p-3">
      <div className="min-w-0 flex-1">
        <div className="mb-2 font-semibold">{device.ip}</div>

        <div className="text-sm">
          <strong className="text-(--meta-text)">Slug:</strong> {device.slug}
        </div>

        {device.platform && (
          <div className="text-sm">
            <strong className="text-(--meta-text)">Платформа:</strong>{' '}
            {device.platform}
          </div>
        )}

        <div className="text-sm">
          <strong className="text-(--meta-text)">User Agent:</strong>{' '}
          {device.userAgent}
        </div>

        <div className="text-sm">
          <strong className="text-(--meta-text)">Последняя активность:</strong>{' '}
          {new Date(device.lastSeenAt).toLocaleString()}
        </div>

        <div className="text-sm">
          <strong className="text-(--meta-text)">С момента:</strong>{' '}
          {new Date(device.firstSeenAt).toLocaleString()}
        </div>
      </div>

      <div className="mr-4 ml-auto flex gap-2">
        {device.hasIntegration && (
          <>
            <DeviceScreenOnAction ip={device.ip} />
            <DeviceScreenOffAction ip={device.ip} />
          </>
        )}
        <ReloadDevicePageButton deviceId={device.deviceId} />
      </div>

      <div className="ml-auto flex gap-2">
        <CommonButton
          type="button"
          onClick={() => onDelete(device.deviceId)}
          tooltip="Удалить устройство"
        >
          <Trash2 className="h-4 w-4" />
        </CommonButton>
      </div>
    </div>
  );
}
