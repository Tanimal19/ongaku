"use client";

import Script from "next/script";
import { useEffect, useContext } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { playerContext } from "@/components/main-panel";

interface YoutubeIframeComponentProps {
  wrapperWidth: number | null;
}

export default function YoutubeIframeComponent({
  wrapperWidth,
}: YoutubeIframeComponentProps) {
  const p = useContext(playerContext);
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
        width = wrapperWidth ? wrapperWidth : 640;
      }
      player.setSize(width, (width * 9) / 16);
    }

    window.addEventListener("resize", () => {
      if (player) {
        let width = 0;
        if (window.innerWidth <= 640) {
          width = window.innerWidth;
        } else {
          width = wrapperWidth ? wrapperWidth : 640;
        }
        player.setSize(width, (width * 9) / 16);
      }
    });
  }, [player]);

  useEffect(() => {
    if (player && wrapperWidth) {
      player.setSize(wrapperWidth, (wrapperWidth * 9) / 16);
    }
  }, [wrapperWidth]);

  return (
    <div className="w-full h-fit sm:rounded-xl sm:overflow-hidden">
      <Script src="https://www.youtube.com/iframe_api" />
      <div id={`youtube-player`}>
        {player ? null : (
          <Skeleton className="w-[320px] h-[180px] mx-auto my-10" />
        )}
      </div>
    </div>
  );
}
