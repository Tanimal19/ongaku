"use client";

import Script from "next/script";
import { useEffect, useContext, useRef } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import { timeContext } from "@/components/main-panel";

export default function YoutubeIframeComponent() {
  const playerRef = useRef(null);
  const p = useContext(timeContext);
  const [player, setPlayer] = p;

  // Create empty player (only once)
  useEffect(() => {
    function onYouTubeIframeAPIReady() {
      const newPlayer = new YT.Player(`youtube-player`, {
        width: "640",
        height: "390",
        videoId: "",
        playerVars: {
          start: 0,
        },
        events: {},
      });
      setPlayer(newPlayer);
    }

    (window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (player) {
      let width = 0;
      if (window.innerWidth <= 640) {
        width = window.innerWidth;
      } else {
        width = Math.min(window.innerWidth / 2, 640);
      }
      player.setSize(width, (width * 9) / 16);
    }

    window.addEventListener("resize", () => {
      if (player) {
        let width = 0;
        if (window.innerWidth <= 640) {
          width = window.innerWidth;
        } else {
          width = Math.min(window.innerWidth / 2, 640);
        }
        player.setSize(width, (width * 9) / 16);
      }
    });
  }, [player]);

  return (
    <div className="w-full h-fit mb-2 sm:mx-4">
      <Script src="https://www.youtube.com/iframe_api" />
      <div ref={playerRef} id={`youtube-player`}>
        {player ? null : (
          <Skeleton className="w-[320px] h-[180px] mx-auto my-10" />
        )}
      </div>
    </div>
  );
}
