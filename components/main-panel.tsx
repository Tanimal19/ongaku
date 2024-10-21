"use client";

import { useState, createContext } from "react";

import { Song } from "@/app/type";

import LyricPanel from "@/components/lyric-panel";
import VideoPanel from "@/components/video-panel";

export const timeContext = createContext<
  [YT.Player | null, (_: YT.Player) => void]
>([null, () => {}]);

export default function MainPanel() {
  const [song, setSong] = useState<Song | null>(null);
  const [player, setPlayer] = useState<YT.Player | null>(null);

  return (
    <div className="w-full overflow-y-auto flex-1 flex flex-col">
      <timeContext.Provider value={[player, setPlayer]}>
        <VideoPanel song={song} setSong={setSong} />
        <LyricPanel song={song} />
      </timeContext.Provider>
    </div>
  );
}
