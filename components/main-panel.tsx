"use client";

import { useEffect, useState, createContext } from "react";
import { Song, YoutubeVideo } from "@/app/type";
import { getLyrics, searchYoutubeVideo } from "@/app/api";
import SearchPanel from "@/components/search-panel";
import SearchResultPanel from "@/components/search-result-panel";
import LyricPanel from "@/components/lyric-panel";
import YoutubeIframeComponent from "@/components/youtubeIframe";

export const timeContext = createContext<
  [YT.Player | null, (_: YT.Player) => void]
>([null, () => {}]);

export default function MainPanel() {
  const [searchState, setSearchState] = useState<string>("idle");
  const [searchSong, setSearchSong] = useState<{
    track: string;
    artist: string;
  } | null>(null);
  const [song, setSong] = useState<Song | null>(null);
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [vIndex, setVIndex] = useState<number | null>(null);
  const [player, setPlayer] = useState<YT.Player | null>(null);

  useEffect(() => {
    if (searchSong && searchState === "search video") {
      const query = `${searchSong.track} ${searchSong.artist}`;
      searchYoutubeVideo(query).then((videos: YoutubeVideo[] | null) => {
        if (videos) {
          setVideos(videos);
        }
      });
    }
  }, [searchSong]);

  useEffect(() => {
    if (vIndex != null && searchSong != null) {
      setSearchState("search lyric");
      setSong(null);
      setVIndex(null);
      getLyrics(searchSong.track, searchSong.artist, videos[vIndex]).then(
        (song: Song | null) => {
          if (song) {
            setSong(song);
            setSearchState("idle");
          }
        }
      );
    }
  }, [vIndex]);

  useEffect(() => {
    if (player && song) {
      player.loadVideoById({
        videoId: song.videoId,
        startSeconds: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song?.videoId]);

  return (
    <div className="w-full">
      <timeContext.Provider value={[player, setPlayer]}>
        <div className="flex flex-col w-1/2 fixed max-h-screen">
          <YoutubeIframeComponent />
          <SearchPanel
            setSearchSong={setSearchSong}
            setSearchState={setSearchState}
          />
          {searchState === "search video" ? (
            <SearchResultPanel videos={videos} setVIndex={setVIndex} />
          ) : null}
        </div>
        <div className="w-1/2 min-h-screen ml-auto mr-0">
          <LyricPanel song={song} />
        </div>
      </timeContext.Provider>
    </div>
  );
}
