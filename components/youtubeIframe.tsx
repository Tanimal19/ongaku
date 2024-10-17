"use client";

import { useEffect, useState } from "react";

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
        height: "390",
        width: "640",
        videoId: "g4IEhywhzIs",
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
    <div className="my-6">
      <div id={`youtube-player`}></div>
    </div>
  );
}
