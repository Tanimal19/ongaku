import { useState, useEffect, useContext } from "react";
import { cn } from "@/lib/utils";

import { SyncLyricLine } from "@/lib/type";

import { Skeleton } from "@/components/ui/skeleton";
import {
  playerContext,
  songContext,
  statusContext,
} from "@/components/player/main-panel";

interface LyricDisplayProps {
  sync: boolean;
  translate: boolean;
  romaji: boolean;
}

export default function LyricDisplay({
  sync,
  translate,
  romaji,
}: LyricDisplayProps) {
  const p = useContext(playerContext);
  const [player] = p;
  const s = useContext(songContext);
  const [song] = s;
  const st = useContext(statusContext);
  const [status] = st;

  const [curIndex, setcurIndex] = useState<number>(0);

  // update synced lyrics
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

    if (song?.supportSync) {
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
  }, [song]);

  return (
    <div>
      {status == "display" && song ? (
        <div>
          {song.syncedLyrics[song.lang] || song.plainLyrics[song.lang] ? (
            <div
              className={cn(
                "flex flex-col w-full h-full sm:px-[20%] items-start font-bold pb-40",
                sync ? "text-stone-400" : "text-stone-950"
              )}
            >
              {Object.values(
                song.supportSync
                  ? song.syncedLyrics[song.lang]
                  : song.plainLyrics[song.lang]
              ).map((line, index) => (
                <div
                  key={line["start"]}
                  className={cn(
                    "flex flex-col my-3",
                    sync ? "hover:opacity-70 cursor-pointer" : null,
                    sync && index <= curIndex
                      ? "text-stone-950"
                      : "text-inherit"
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
                  <p className="text-xl">
                    {song.supportSync ? line["text"] : line}
                  </p>

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
          ) : (
            <div className="w-full inline-flex justify-center font-bold text-xl">
              沒找到歌詞 :(
            </div>
          )}
        </div>
      ) : (
        <div>
          {status == "fetching" ? (
            <div className="flex flex-col items-center gap-y-4 my-4">
              searching for lyrics...
              <Skeleton className="h-6 w-52 sm:w-1/2" />
              <Skeleton className="h-6 w-64 sm:w-1/2" />
              <Skeleton className="h-6 w-52 sm:w-1/2" />
              <Skeleton className="h-6 w-64 sm:w-1/2" />
              <Skeleton className="h-6 w-52 sm:w-1/2" />
            </div>
          ) : (
            <div className="w-full inline-flex justify-center font-bold text-xl">
              用右上角的搜尋功能找一下歌吧 :)
            </div>
          )}
        </div>
      )}
    </div>
  );
}
