import { useState, useEffect, useContext } from "react";
import { cn } from "@/lib/utils";

import { Song, SyncLyricLine } from "@/app/type";

import { timeContext } from "@/components/main-panel";

interface LyricDisplayProps {
  song: Song;
  sync: boolean;
  translate: boolean;
  romaji: boolean;
}

export default function LyricDisplay({
  song,
  sync,
  translate,
  romaji,
}: LyricDisplayProps) {
  const p = useContext(timeContext);
  const [player, _] = p;
  const [curIndex, setcurIndex] = useState<number>(0);

  useEffect(() => {
    function calculateCurIndex(
      lyric: SyncLyricLine[],
      curIndex: number,
      currentTime: number
    ) {
      if (
        curIndex + 1 < lyric.length &&
        parseFloat(lyric[curIndex]["start"]) <= currentTime &&
        currentTime <= parseFloat(lyric[curIndex + 1]["start"])
      ) {
        // time is between curIndex and curIndex + 1, do nothing
        return curIndex;
      }

      // find
      for (let i = 0; i < lyric.length; i++) {
        if (parseFloat(lyric[i]["start"]) >= currentTime) {
          return Math.max(0, i - 1);
        }
      }
      return lyric.length - 1;
    }

    if (song.supportSync) {
      const interval = setInterval(() => {
        if (player) {
          const currentTime = player.getCurrentTime();
          const lyric = song.syncedLyrics[song.lang];

          if (typeof lyric !== "string") {
            setcurIndex((prev) => calculateCurIndex(lyric, prev, currentTime));
          }
        }
      }, 200);

      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className={cn("flex flex-col text-stone-400 w-full pb-40 my-4")}>
      {Object.values(
        song.supportSync
          ? song.syncedLyrics[song.lang]
          : song.plainLyrics[song.lang]
      ).map((line, index) => (
        <div
          key={line["start"]}
          className={cn(
            "flex flex-col my-2 hover:opacity-70",
            sync && index <= curIndex ? "text-stone-950" : "text-inherit"
          )}
          onClick={
            sync
              ? () => {
                  player?.seekTo(parseFloat(line["start"]), true);
                  player?.playVideo();
                  setcurIndex(index);
                }
              : undefined
          }
        >
          <p className="text-base">{song.supportSync ? line["text"] : line}</p>

          {song.supportRomaji && romaji ? (
            <p className="text-sm">
              {song.supportSync
                ? song.syncedLyrics["roma"][index]["text"]
                : song.plainLyrics["roma"][index]}
            </p>
          ) : null}

          {song.supportTranslate && translate ? (
            <p className="text-sm">
              {song.supportSync
                ? song.syncedLyrics["zh"][index]["text"]
                : song.plainLyrics["zh"][index]}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
