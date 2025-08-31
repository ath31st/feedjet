import { useEffect, useCallback } from 'react';
import { useEventSource } from '@/shared/api/sse/useEventSource';
import { useVideoStore } from '..';
import { SERVER_URL } from '@/shared/config/env';

const VIDEO_SSE_URL = `${SERVER_URL}/sse/feed`;

export function useVideoSse() {
  const initStore = useVideoStore((s) => s.initStore);
  const setVideos = useVideoStore((s) => s.setVideos);

  useEffect(() => {
    initStore();
  }, [initStore]);

  const onMessage = useCallback(
    (e: MessageEvent) => {
      try {
        const videos = JSON.parse(e.data) as Array<
          import('@shared/types/video').VideoMetadata
        >;
        setVideos(videos);
      } catch {}
    },
    [setVideos],
  );

  useEventSource(VIDEO_SSE_URL, onMessage);
}
