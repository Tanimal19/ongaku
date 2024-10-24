import { Song, YoutubeVideo } from "@/app/type"

export async function searchYoutubeVideo(query: string): Promise<YoutubeVideo[] | null> {
  const response = await fetch("/api/search-youtube", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "query": query,
      "max_results": 5,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error(errorData.error || "Failed to search videos");
    return null;
  }

  const videos: YoutubeVideo[] = await response.json();

  return videos;
}

export async function getYoutubeVideo(videoId: string): Promise<YoutubeVideo | null> {
  const response = await fetch("/api/get-youtube-video", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "videoId": videoId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error(errorData.error || "Failed to get video info");
    return null;
  }

  const video: YoutubeVideo = await response.json();

  return video;
}

export async function getLyrics(track: string, artist: string, video: YoutubeVideo): Promise<Song | null> {
  const response = await fetch("/api/get-lyrics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "track": track,
      "artist": artist,
      "video": video,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error(errorData.error || "Failed to get lyrics");
    return null;
  }

  let song: any = await response.json();

  if (song.syncedLyrics) {
    Object.entries(song.syncedLyrics).map((ent) => {
      if (typeof ent[1] === "string") {
        song.syncedLyrics[ent[0]] = JSON.parse(ent[1]);
      }
    });
  }

  if (song.plainLyrics) {
    Object.entries(song.plainLyrics).map((ent) => {
      if (typeof ent[1] === "string") {
        song.plainLyrics[ent[0]] = ent[1].split("\n");
      }
    });
  }

  song.title = video.title;

  console.log(song);

  return song as Song;
}