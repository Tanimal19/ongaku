"use client";

import { useEffect, useState, useContext } from "react";
import LyricDisplay from "@/components/player/lyric-display";
import ControlPanel from "@/components/player/control-panel";
import { songContext } from "@/app/page";

export default function LyricPanel() {
  const s = useContext(songContext);
  const [song] = s;

  const [sync, setSync] = useState<boolean>(false);
  const [translate, setTranslate] = useState<boolean>(false);
  const [romaji, setRomaji] = useState<boolean>(false);

  useEffect(() => {
    setSync(song?.supportSync == true);
    setTranslate(false);
    setRomaji(false);
  }, [song?.videoId]);

  return (
    <div className="w-full h-full flex-1 overflow-y-scroll px-4">
      <LyricDisplay sync={sync} translate={translate} romaji={romaji} />

      <ControlPanel
        props={{
          sync,
          setSync,
          translate,
          setTranslate,
          romaji,
          setRomaji,
        }}
      />
    </div>
  );
}
