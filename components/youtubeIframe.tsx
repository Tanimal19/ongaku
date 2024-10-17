"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Script from "next/script";

interface YoutubeIframeComponentProps {
  videoId: string;
  time: string;
  status?: number;
}

export default function YoutubeIframeComponent({
  videoId,
  time,
  status,
}: YoutubeIframeComponentProps) {
  const [player, setPlayer] = useState<any>(null);

  // Load video when videoId changes
  useEffect(() => {
    if (player) {
      player.loadVideoById({
        videoId: videoId,
        startSeconds: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  // Seek to time when time changes
  useEffect(() => {
    if (player) {
      player.seekTo(time, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  // Play or pause video when status changes
  useEffect(() => {
    if (player) {
      if (status === 1) {
        player.playVideo();
      } else if (status === 0) {
        player.pauseVideo();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Create empty player (only once)
  useEffect(() => {
    function onYouTubeIframeAPIReady() {
      const newPlayer = new YT.Player(`youtube-player`, {
        height: "300",
        width: "500",
        videoId: videoId,
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
    <div className="max-w-full my-6">
      <Script src="https://www.youtube.com/iframe_api" />
      <div id={`youtube-player`}>{player ? null : <Skeleton />}</div>
    </div>
  );
}
