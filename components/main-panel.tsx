"use client";

import { useState, createContext } from "react";

import { Song } from "@/app/type";

import LyricPanel from "@/components/lyric-panel";
import VideoPanel from "@/components/video-panel";
import SearchDialog from "@/components/search-dialog";
import { LogoSVG } from "@/components/svg";

export const timeContext = createContext<
  [YT.Player | null, (_: YT.Player) => void]
>([null, () => {}]);

export default function MainPanel() {
  const [song, setSong] = useState<Song | null>(null);
  const [player, setPlayer] = useState<YT.Player | null>(null);

  return (
    <div className="max-w-screen max-h-screen flex flex-col sm:items-end">
      <timeContext.Provider value={[player, setPlayer]}>
        <div className="w-screen sticky top-0">
          <div className="w-full h-fit p-4 flex flex-row justify-between items-center border-b">
            <LogoSVG />
            <SearchDialog setSong={setSong} />
          </div>
          <VideoPanel song={song} />
        </div>
        <LyricPanel song={song} />
      </timeContext.Provider>
    </div>
  );
}
