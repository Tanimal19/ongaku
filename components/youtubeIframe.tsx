"use client";

import Script from "next/script";
import { useEffect, useContext } from "react";
import { timeContext } from "@/components/main-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function YoutubeIframeComponent() {
  const p = useContext(timeContext);
  const [player, setPlayer] = p;

  // Create empty player (only once)
  useEffect(() => {
    function onYouTubeIframeAPIReady() {
      const newPlayer = new YT.Player(`youtube-player`, {
        height: "390",
        width: "640",
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

  return (
    <div className="max-w-full my-4">
      <Script src="https://www.youtube.com/iframe_api" />
      <div id={`youtube-player`}>{player ? null : <Skeleton />}</div>
    </div>
  );
}
