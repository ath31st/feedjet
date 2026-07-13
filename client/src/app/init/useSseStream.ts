import { useCallback } from 'react';
import { useEventSource } from '@/shared/api';

import { SERVER_URL, SSE_URL } from '@/shared/config';
import { useRssFeedStore, type FeedItem } from '@/entities/feed';
import { useUiConfigStore, type UiConfig } from '@/entities/ui-config';
import { useFeedConfigStore, type FeedConfig } from '@/entities/feed-config';
import type { ControlEvent } from '@shared/types/control.event';
import type { TickerConfig } from '@/entities/ticker-config';
import { useTickerConfigStore } from '@/entities/ticker-config';
import { useScenarioStore, type Scenario } from '@/entities/scenario';
import { useDeviceStore } from '@/entities/device';
import {
  useBrandingConfigStore,
  type BrandingConfig,
  type Logo,
} from '@/entities/branding';

export function useSseStream(kioskId: number) {
  console.log('SSE: currentKioskId', kioskId);

  const setFeeds = useRssFeedStore((s) => s.setFeeds);
  const setUiConfig = useUiConfigStore((s) => s.setConfig);
  const setBrandingConfig = useBrandingConfigStore((s) => s.setConfig);
  const setBrandingLogo = useBrandingConfigStore((s) => s.setLogo);
  const setTickerConfig = useTickerConfigStore((s) => s.setConfig);
  const setFeedConfig = useFeedConfigStore((s) => s.setConfig);
  const setScenario = useScenarioStore((s) => s.setScenario);
  const deviceId = useDeviceStore((s) => s.deviceId);

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
            const event = payload as ControlEvent;
            if (
              event.deviceId === deviceId &&
              event.command === 'reload-device'
            ) {
              window.location.reload();
            }
            break;
          }

          case 'ui-config':
            console.log('SSE: Received UI CONFIG');
            setUiConfig(payload as UiConfig);
            break;

          case 'branding-config':
            console.log('SSE: Received BRANDING CONFIG');
            setBrandingConfig(payload as BrandingConfig);
            break;

          case 'branding-logo':
            console.log('SSE: Received BRANDING LOGO');
            setBrandingLogo(payload as Logo);
            break;

          case 'feed-config':
            console.log('SSE: Received FEED CONFIG');
            setFeedConfig(payload as FeedConfig);
            break;

          case 'ticker-config':
            console.log('SSE: Received TICKER CONFIG');
            setTickerConfig(payload as TickerConfig);
            break;

          case 'scenario': {
            console.log('SSE: Received SCENARIO');
            const scenario = payload as Scenario;
            setScenario(scenario);
            break;
          }

          case 'keepalive':
            console.log('SSE: Received KEEPALIVE');
            break;

          default:
            console.warn(`SSE: Unknown message type received: ${type}`);
        }
      } catch (error) {
        console.error('Error processing SSE message:', error, e.data);
      }
    },
    [
      setFeeds,
      setUiConfig,
      setBrandingConfig,
      setBrandingLogo,
      setFeedConfig,
      setTickerConfig,
      setScenario,
      deviceId,
    ],
  );

  const streamUrl = `${SERVER_URL}${SSE_URL.STREAM(kioskId)}`;

  useEventSource(streamUrl, onMessage);
}
