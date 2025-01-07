export type SyncLyricLine = {
  "start": string;
  "text": string;
}

export type PlainLyricLine = string;

export interface Song {
  title: string;
  track: string;
  artist: string;
  lang: string;
  videoId: string;
  supportSync: boolean;
  supportTranslate: boolean;
  supportRomaji: boolean;
  plainLyrics: Record<string, PlainLyricLine[]>;
  syncedLyrics: Record<string, SyncLyricLine[]>;
}


export interface YoutubeVideo {
  videoId: string;
  title: string;
  description: string;
  channelName: string;
  channelId: string;
}