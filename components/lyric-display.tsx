import { PlainLyricLine, Song, SyncLyricLine } from "@/app/type";
import { useState, useEffect, useContext } from "react";
import { timeContext } from "@/components/main-panel";
import { cn } from "@/lib/utils";
import { inter, notoSansJP, notoSansTC, notoSansKR } from "@/app/font";

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
  const [font, setFont] = useState<string>(inter.className);

  useEffect(() => {
    switch (song.lang) {
      case "jp":
        setFont(notoSansJP.className);
        break;
      case "kr":
        setFont(notoSansKR.className);
        break;
      case "zh":
        setFont(notoSansTC.className);
        break;
      default:
        setFont(inter.className);
    }
  }, [song.lang]);

  return (
    <div className={cn(font, "")}>
      {song.supportSync ? (
        <SyncLyricDisplay
          song={song}
          sync={sync}
          translate={translate}
          romaji={romaji}
        />
      ) : (
        <PlainLyricDisplay
          song={song}
          sync={sync}
          translate={translate}
          romaji={romaji}
        />
      )}
    </div>
  );
}

function PlainLyricDisplay({ song, translate, romaji }: LyricDisplayProps) {
  return (
    <div>
      {Object.values(song.plainLyrics[song.lang]).map(
        (line: PlainLyricLine, index) => (
          <div key={index}>
            {song.supportRomaji && romaji ? (
              <p>{song.plainLyrics["roma"][index]}</p>
            ) : null}
            <p>{line}</p>
            {song.supportTranslate && translate ? (
              <p>{song.plainLyrics["zh"][index]}</p>
            ) : null}
          </div>
        )
      )}
    </div>
  );
}

function SyncLyricDisplay({
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

      // recalculate curIndex
      for (let i = curIndex + 1; i < lyric.length; i++) {
        if (parseFloat(lyric[i]["start"]) >= currentTime) {
          return i - 1;
        }
      }
      return lyric.length - 1;
    }

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
  }, []);

  return (
    <div>
      {Object.values(song.syncedLyrics[song.lang]).map(
        (line: SyncLyricLine, index) => (
          <div key={line["start"]} className="flex flex-col gap-y-2">
            {song.supportRomaji && romaji ? (
              <p className="text-sm">
                {song.syncedLyrics["roma"][index]["text"]}
              </p>
            ) : null}
            {sync ? (
              <p
                className={cn(
                  "text-base hover:opacity-60",
                  index == curIndex ? "text-pink-400" : "text-inherit"
                )}
                onClick={() => {
                  player?.seekTo(parseFloat(line["start"]), true);
                  setcurIndex(index);
                }}
              >
                {line["text"]}
              </p>
            ) : (
              <p>{line["text"]}</p>
            )}
            {song.supportTranslate && translate ? (
              <p className="text-sm">
                {song.syncedLyrics["zh"][index]["text"]}
              </p>
            ) : null}
          </div>
        )
      )}
    </div>
  );
}
