"use client";

import { useEffect, useState } from "react";

import { Song } from "@/app/type";

import { Skeleton } from "@/components/ui/skeleton";
import LyricDisplay from "@/components/lyric-display";
import Player from "@/components/player";

interface LyricPanelProps {
  song: Song | null;
}

export default function LyricPanel({ song }: LyricPanelProps) {
  const [sync, setSync] = useState<boolean>(false);
  const [translate, setTranslate] = useState<boolean>(false);
  const [romaji, setRomaji] = useState<boolean>(false);

  useEffect(() => {
    setSync(song?.supportSync == true);
    setTranslate(false);
    setRomaji(false);
  }, [song?.videoId]);

  return (
    <div className="w-full overflow-y-scroll flex-1 px-4 sm:w-1/2 sm:pl-20 sm:mt-8">
      {song ? (
        <LyricDisplay
          song={song}
          sync={sync}
          translate={translate}
          romaji={romaji}
        />
      ) : (
        <div className="flex flex-col items-center gap-y-4 my-4">
          <Skeleton className="h-6 w-52 sm:w-1/2" />
          <Skeleton className="h-6 w-64 sm:w-1/2" />
          <Skeleton className="h-6 w-52 sm:w-1/2" />
          <Skeleton className="h-6 w-64 sm:w-1/2" />
          <Skeleton className="h-6 w-52 sm:w-1/2" />
        </div>
      )}

      <Player
        song={song}
        sync={sync}
        setSync={setSync}
        translate={translate}
        setTranslate={setTranslate}
        romaji={romaji}
        setRomaji={setRomaji}
      />
    </div>
  );
}
