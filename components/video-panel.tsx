"use client";

import { useState, useEffect, useContext } from "react";
import { cn } from "@/lib/utils";

import { Song } from "@/app/type";

import { Separator } from "@/components/ui/separator";
import { timeContext } from "@/components/main-panel";
import YoutubeIframeComponent from "@/components/youtubeIframe";

interface VideoPanelProps {
  song: Song | null;
}

export default function VideoPanel({ song }: VideoPanelProps) {
  const [hideIframe, setHideIframe] = useState<boolean>(false);
  const p = useContext(timeContext);
  const [player, _] = p;

  // load video when select
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
          "transition-all duration-200 overflow-hidden",
          hideIframe ? "max-h-0" : "max-h-[1000px]"
        )}
      >
        <YoutubeIframeComponent />
      </div>
      <Separator className="mb-2" />
      <div
        className="bg-transparent backdrop-blur-lg w-full inline-flex justify-center md:hidden"
        onClick={() => {
          setHideIframe((prev) => !prev);
        }}
      >
        <svg
          className={cn(
            "transition-transform duration-200",
            hideIframe ? "rotate-180" : "rotate-0"
          )}
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
