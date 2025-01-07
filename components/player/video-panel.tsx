"use client";

import { useState, useEffect, useContext } from "react";
import { cn } from "@/lib/utils";
import YoutubeIframeComponent from "@/components/player/youtubeIframe";
import { playerContext } from "@/app/page";
import { songContext } from "@/app/page";
import Icon from "../icon";

interface VideoPanelProps {
  wrapperWidth: number | null;
}

export default function VideoPanel({ wrapperWidth }: VideoPanelProps) {
  const p = useContext(playerContext);
  const [player] = p;
  const s = useContext(songContext);
  const [song] = s;

  const [hideIframe, setHideIframe] = useState<boolean>(false);

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
    <div className="w-full sm:mx-6 h-fit sm:w-fit">
      <div
        className={cn(
          "transition-all duration-200 overflow-hidden",
          hideIframe ? "max-h-0" : "max-h-[1000px]"
        )}
      >
        <YoutubeIframeComponent
          // minus margin width
          wrapperWidth={wrapperWidth ? wrapperWidth - 48 : null}
        />
      </div>
      <div
        className="bg-transparent backdrop-blur-lg w-full inline-flex justify-center sm:hidden"
        onClick={() => {
          setHideIframe((prev) => !prev);
        }}
      >
        <div
          className={cn(
            "transition-transform duration-200",
            hideIframe ? "rotate-180" : "rotate-0"
          )}
        >
          <Icon id="chevron-down" />
        </div>
      </div>
    </div>
  );
}
