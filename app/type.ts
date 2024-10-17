export type SyncLyric = {
  "start-time": string;
  "text": string;
}

export type PlainLyric = string[];

export interface Song {
  track: string;
  artist: string;
  lang: string;
  videoId: string;
  plainLyrics: Record<string, PlainLyric>;
  syncedLyrics: Record<string, SyncLyric>;
}


export interface YoutubeVideo {
  videoId: string;
  title: string;
  description: string;
  channelName: string;
  channelId: string;
}