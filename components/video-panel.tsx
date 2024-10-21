"use client";

import { useState, useEffect, useContext } from "react";
import { cn } from "@/lib/utils";

import { Song, YoutubeVideo } from "@/app/type";
import { getLyrics, searchYoutubeVideo } from "@/app/api";

import { Separator } from "@/components/ui/separator";
import SearchPanel from "@/components/search-panel";
import { timeContext } from "@/components/main-panel";
import SearchResultPanel from "@/components/search-result-panel";
import YoutubeIframeComponent from "@/components/youtubeIframe";

interface VideoPanelProps {
  song: Song | null;
  setSong: (_: any) => void;
}

export default function VideoPanel({ song, setSong }: VideoPanelProps) {
  const [searchState, setSearchState] = useState<string>("idle");
  const [searchSong, setSearchSong] = useState<{
    track: string;
    artist: string;
  } | null>(null);
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [vIndex, setVIndex] = useState<number | null>(null);
  const [hideIframe, setHideIframe] = useState<boolean>(false);
  const p = useContext(timeContext);
  const [player, _] = p;

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
    <div className="w-full h-fit md:w-1/2 md:max-w-[640px]">
      <div
        className={cn(
          "transition-all duration-300 overflow-hidden",
          hideIframe ? "max-h-0" : "max-h-[1000px]"
        )}
      >
        <YoutubeIframeComponent />
        <SearchPanel
          setSearchSong={setSearchSong}
          setSearchState={setSearchState}
        />
        {searchState === "search video" ? (
          <SearchResultPanel videos={videos} setVIndex={setVIndex} />
        ) : null}
      </div>
      <Separator className="mb-2" />
      <div
        className={cn(
          "bg-transparent backdrop-blur-lg w-full inline-flex justify-center transition-transform duration-200 md:hidden",
          hideIframe ? "-rotate-180" : "rotate-0"
        )}
        onClick={() => {
          setHideIframe((prev) => !prev);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          width="24px"
          viewBox="0 -960 960 960"
          fill="#000000"
        >
          <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" />
        </svg>
      </div>
    </div>
  );
}
