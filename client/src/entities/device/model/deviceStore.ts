import { generateUUID } from '@/shared/lib';
import { create } from 'zustand';

interface DeviceState {
  deviceId: string;
}

export const useDeviceStore = create<DeviceState>()(() => {
  const STORAGE_KEY = 'device_id';

  const existing = localStorage.getItem(STORAGE_KEY);
  const deviceId = existing ?? generateUUID();

  if (!existing) {
    localStorage.setItem(STORAGE_KEY, deviceId);
  }

  return {
    deviceId,
  };
});
