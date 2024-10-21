"use client";

import { useContext, useEffect, useState } from "react";

import { Slider } from "@/components/ui/slider";
import { timeContext } from "@/components/main-panel";

export default function Player() {
  const p = useContext(timeContext);
  const [player, _] = p;
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (player) {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        setProgress((currentTime / duration) * 100);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-4">
      <Slider
        defaultValue={[0]}
        value={[progress]}
        onValueChange={(value) => {
          if (player) {
            const duration = player.getDuration();
            player.seekTo((value[0] * duration) / 100, true);
          }
        }}
      />
    </div>
  );
}
