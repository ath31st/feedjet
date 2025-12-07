export const PlaylistState = {
  Idle: 'Idle',
  Playing: 'Playing',
  Finished: 'Finished',
} as const;

export type PlaylistState = (typeof PlaylistState)[keyof typeof PlaylistState];
