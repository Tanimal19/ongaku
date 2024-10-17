import { Song } from "@/app/type";
import { useEffect } from "react";

interface LyricDisplayProps {
  song: Song;
  sync: boolean;
  translate: boolean;
  romaji: boolean;
  time: string;
  setTime: (time: any) => void;
}

export default function LyricDisplay({
  song,
  sync,
  translate,
  romaji,
  time,
  setTime,
}: LyricDisplayProps) {
  return (
    <div>
      {song.supportSync
        ? Object.values(song.syncedLyrics[song.lang]).map((line) => (
            <div key={line["start"]}>
              <p>{line["text"]}</p>
            </div>
          ))
        : Object.values(song.plainLyrics[song.lang]).map((line, index) => (
            <div key={index}>
              <p>{line}</p>
            </div>
          ))}
    </div>
  );
}
