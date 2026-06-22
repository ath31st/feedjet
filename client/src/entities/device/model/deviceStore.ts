import { create } from 'zustand';

interface DeviceState {
  deviceId: string;
  initStore: () => void;
}

const STORAGE_KEY = 'device_id';

export const useDeviceStore = create<DeviceState>()((set) => ({
  deviceId: '',

  initStore: () => {
    const existing = localStorage.getItem(STORAGE_KEY);

    const deviceId = existing ?? crypto.randomUUID();

    if (!existing) {
      localStorage.setItem(STORAGE_KEY, deviceId);
    }

    set({ deviceId });
  },
}));
