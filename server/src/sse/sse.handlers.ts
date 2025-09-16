import type { ControlEvent } from '@shared/types/control.event.js';
import { createSseHandler } from './sse.handlers.factory.js';
import type { FeedConfig } from '@shared/types/feed.config.js';
import type { FeedItem } from '@shared/types/feed.js';
import type { UiConfig } from '@shared/types/ui.config.js';
import type { VideoMetadata } from '@shared/types/video.js';

export const controlSseHandler = createSseHandler<ControlEvent>('control');
export const feedConfigSseHandler = createSseHandler<FeedConfig>('feed-config');
export const feedSseHandler = createSseHandler<FeedItem[]>('feed');
export const uiConfigSseHandler = createSseHandler<UiConfig>('ui-config');
export const videoSseHandler = createSseHandler<VideoMetadata[]>('video');
