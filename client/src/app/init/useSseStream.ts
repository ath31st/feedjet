import { useCallback } from 'react';
import { useEventSource } from '@/shared/api';

import { SERVER_URL, SSE_URL } from '@/shared/config';
import { useKioskStore } from '@/entities/kiosk';
import { useRssFeedStore, type FeedItem } from '@/entities/feed';
import { useUiConfigStore, type UiConfig } from '@/entities/ui-config';
import { useVideoStore, type VideoMetadata } from '@/entities/video';
import { useFeedConfigStore, type FeedConfig } from '@/entities/feed-config';
import type { ControlEvent } from '@shared/types/control.event';

export function useSseStream() {
  const { currentKiosk } = useKioskStore();
  const currentKioskId = currentKiosk?.id || 0;
  console.log('SSE: currentKioskId', currentKioskId);

  const setFeeds = useRssFeedStore((s) => s.setFeeds);
  const setUiConfig = useUiConfigStore((s) => s.setConfig);
  const setVideo = useVideoStore((s) => s.setVideos);
  const setFeedConfig = useFeedConfigStore((s) => s.setConfig);

  const onMessage = useCallback(
    (e: MessageEvent) => {
      try {
        const { type, payload } = JSON.parse(e.data);

        switch (type) {
          case 'feed':
            console.log('SSE: Received FEED');
            setFeeds(payload as Array<FeedItem>);
            break;

          case 'control': {
            console.log('SSE: Received CONTROL');
            const msg = payload as ControlEvent;
            if (msg.type === 'reload-kiosk') {
              window.location.reload();
            }
            break;
          }

          case 'ui-config':
            console.log('SSE: Received UI CONFIG');
            setUiConfig(payload as UiConfig);
            break;

          case 'feed-config':
            console.log('SSE: Received FEED CONFIG');
            setFeedConfig(payload as FeedConfig);
            break;

          case 'video':
            console.log('SSE: Received VIDEO');
            setVideo(payload as Array<VideoMetadata>);
            break;

          default:
            console.warn(`SSE: Unknown message type received: ${type}`);
        }
      } catch (error) {
        console.error('Error processing SSE message:', error, e.data);
      }
    },
    [setFeeds, setUiConfig, setFeedConfig, setVideo],
  );

  const streamUrl = `${SERVER_URL}${SSE_URL.STREAM(currentKioskId)}`;

  useEventSource(streamUrl, onMessage);
}
