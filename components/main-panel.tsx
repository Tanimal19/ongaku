"use client";

import { useEffect, useState } from "react";

import { Song, YoutubeVideo } from "@/app/type";
import { getLyrics, searchYoutubeVideo } from "@/app/api";

import SearchPanel from "@/components/search-panel";
import SearchResultPanel from "@/components/search-result-panel";
import LyricPanel from "@/components/lyric-panel";

export default function MainPanel() {
  const [isSearching, setIsSearching] = useState(false);
  const [song, setSong] = useState<Song | null>(null);
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [vIndex, setVIndex] = useState<number | null>(null);

  useEffect(() => {
    if (song && isSearching) {
      const query = `${song.track} ${song.artist}`;
      searchYoutubeVideo(query).then((videos: YoutubeVideo[] | null) => {
        if (videos) {
          setVideos(videos);
        }
      });
    }
  }, [song]);

  useEffect(() => {
    if (vIndex != null && song != null) {
      setIsSearching(false);
      setVIndex(null);
      getLyrics(song.track, song.artist, videos[vIndex]).then(
        (song: Song | null) => {
          if (song) {
            setSong(song);
          }
        }
      );
    }
  }, [vIndex]);

  return (
    <div className="flex flex-row gap-x-10">
      <div className="flex flex-col gap-y-6">
        <SearchPanel setSong={setSong} setIsSearching={setIsSearching} />
        {isSearching ? (
          <SearchResultPanel videos={videos} setVIndex={setVIndex} />
        ) : null}
      </div>
      <LyricPanel song={song} />
    </div>
  );
}
