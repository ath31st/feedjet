import { useCallback, useState } from 'react';

const VOLUME_KEY = 'video-volume';
const MUTED_KEY = 'video-muted';

export function usePersistentVolume() {
  const [volume, setVolume] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(VOLUME_KEY);
      return saved ? Number(saved) : 1;
    }
    return 1;
  });

  const [muted, setMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(MUTED_KEY) === 'true';
    }
    return false;
  });

  const ref = useCallback(
    (el: HTMLVideoElement | null) => {
      if (!el) return;

      el.volume = volume;
      el.muted = muted;

      const handleVolumeChange = () => {
        localStorage.setItem(VOLUME_KEY, String(el.volume));
        localStorage.setItem(MUTED_KEY, String(el.muted));
        setVolume(el.volume);
        setMuted(el.muted);
      };

      el.addEventListener('volumechange', handleVolumeChange);

      return () => {
        el.removeEventListener('volumechange', handleVolumeChange);
      };
    },
    [volume, muted],
  );

  return ref;
}
