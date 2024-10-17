export type SyncLyricLine = {
  "start": string;
  "text": string;
}

export type PlainLyricLine = string;

export interface Song {
  track: string;
  artist: string;
  lang: string;
  videoId: string;
  supportSync: boolean;
  supportTranslate: boolean;
  supportRomaji: boolean;
  plainLyrics: Record<string, PlainLyricLine[] | string>;
  syncedLyrics: Record<string, SyncLyricLine[] | string>;
}


export interface YoutubeVideo {
  videoId: string;
  title: string;
  description: string;
  channelName: string;
  channelId: string;
}