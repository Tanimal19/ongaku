"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

import { Song, YoutubeVideo } from "@/app/type";
import { getLyrics, searchYoutubeVideo } from "@/app/api";

import { Skeleton } from "@/components/ui/skeleton";
import SearchPanel from "@/components/search-panel";
import SearchResultPanel from "@/components/search-result-panel";
import LyricPanel from "@/components/lyric-panel";
import YoutubeIframeComponent from "@/components/youtubeIframe";

export default function MainPanel() {
  const [searchState, setSearchState] = useState<string>("idle");
  const [searchSong, setSearchSong] = useState<{
    track: string;
    artist: string;
  } | null>(null);
  const [song, setSong] = useState<Song | null>(null);
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [vIndex, setVIndex] = useState<number | null>(null);

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

  return (
    <div className="flex flex-row gap-x-10">
      <div className="flex flex-col gap-y-6 w-1/3">
        <SearchPanel
          setSearchSong={setSearchSong}
          setSearchState={setSearchState}
        />
        {searchState === "search video" ? (
          <SearchResultPanel videos={videos} setVIndex={setVIndex} />
        ) : null}
        {song ? (
          <YoutubeIframeComponent
            videoId={song.videoId}
            time={"0"}
            status={1}
          />
        ) : null}
      </div>
      <div className="w-2/3 min-h-screen">
        {song ? (
          <div>
            <LyricPanel song={song} />
          </div>
        ) : (
          searchState === "search lyric" && (
            <Skeleton className="w-full h-full" />
          )
        )}
      </div>
    </div>
  );
}
