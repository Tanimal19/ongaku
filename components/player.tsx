"use client";

import { useContext, useEffect, useState } from "react";
import { Song } from "@/app/type";

import { Toggle } from "@/components/ui/toggle";
import { Slider } from "@/components/ui/slider";
import { timeContext } from "@/components/main-panel";
import { PauseSVG, PlaySVG } from "./svg";

interface PlayerProps {
  song: Song | null;
  sync: boolean;
  setSync: (_: any) => void;
  translate: boolean;
  setTranslate: (_: any) => void;
  romaji: boolean;
  setRomaji: (_: any) => void;
}

export default function Player({
  song,
  sync,
  setSync,
  translate,
  setTranslate,
  romaji,
  setRomaji,
}: PlayerProps) {
  const p = useContext(timeContext);
  const [player, _] = p;
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (player) {
        const currentTime = player.getCurrentTime();
        setCurrentTime(currentTime);
        const duration = player.getDuration();
        setDuration(duration);

        setIsPlaying(player.getPlayerState() === 1);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [song]);

  return (
    <div className="flex flex-col items-center fixed bottom-0 left-0 w-full bg-stone-300 bg-opacity-30 backdrop-blur-lg px-4 py-4">
      <div className="flex flex-row w-full items-center h-10 gap-x-2 sm:px-10">
        {song ? (
          <p className="flex-1 line-clamp-1 font-bold text-sm">{song.title}</p>
        ) : (
          <p className="flex-1 line-clamp-1 font-bold text-sm opacity-40">
            目前沒有音樂正在撥放
          </p>
        )}

        <div
          className="flex-2 hover:opacity-60"
          onClick={() => {
            if (player && player.getPlayerState() === 1) {
              player.pauseVideo();
              setIsPlaying(false);
            } else if (player && player.getPlayerState() === 2) {
              player.playVideo();
              setIsPlaying(true);
            }
          }}
        >
          {isPlaying ? <PauseSVG /> : <PlaySVG />}
        </div>

        <div className="flex-1 flex flex-row gap-x-1 justify-end">
          <Toggle
            size="sm"
            aria-label="sync"
            disabled={
              !song ||
              song.supportSync == false ||
              song.supportSync == undefined
            }
            onClick={() => setSync((prev: boolean) => !prev)}
            pressed={sync}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              width="20px"
              viewBox="0 -960 960 960"
              fill="#5f6368"
            >
              <path d="M480-120q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q82 0 155.5 35T760-706v-94h80v240H600v-80h110q-41-56-101-88t-129-32q-117 0-198.5 81.5T200-480q0 117 81.5 198.5T480-200q105 0 183.5-68T756-440h82q-15 137-117.5 228.5T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z" />
            </svg>
          </Toggle>
          <Toggle
            size="sm"
            aria-label="romaji"
            disabled={
              !song ||
              song.supportRomaji == false ||
              song.supportRomaji == undefined
            }
            onClick={() => setRomaji((prev: boolean) => !prev)}
            pressed={romaji}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              width="20px"
              viewBox="0 -960 960 960"
              fill="#5f6368"
            >
              <path d="m326-240-30-48q80-8 125-43t45-90q0-30-20.5-55T392-512q-23 57-54.5 102T268-332q3 12 6.5 24t7.5 24l-50 15q-3-10-5-17.5t-4-13.5q-26 14-49 21.5t-45 7.5q-32 0-52-21t-20-56q0-53 40-105t103-82q1-19 2-37.5t3-37.5q-28 1-59-.5T79-615l-1-53q26 5 56 6.5t77 1.5q2-18 4.5-35.5t.5-35.5l60 1q-7 17-10 34.5t-6 34.5q58-3 107-9t92-16l1 52q-53 8-103.5 13.5T255-612q-2 14-2.5 29t-2.5 29q28-8 54.5-11t52.5-1q3-10 4.5-20t2.5-20l57 14q-3 8-6.5 16t-6.5 19q51 14 81.5 52t30.5 85q0 70-51.5 117.5T326-240Zm-188-85q17 0 35-7t38-21q-7-38-10-69t-3-59q-38 24-63 59t-25 66q0 13 8.5 22t19.5 9Zm118-65q29-28 50.5-60.5T342-520q-23 0-46.5 4T248-504q-2 26 .5 54t7.5 60Zm446 56q28 0 54.5-13t48.5-37v-106q-23 3-42.5 7t-36.5 9q-45 14-67.5 35T636-390q0 26 18 41t48 15Zm-23 68q-57 0-90-32.5T556-387q0-52 33-85t106-53q23-6 50.5-11t59.5-9q-2-47-22-68.5T721-635q-26 0-51.5 9.5T604-592l-32-56q33-25 77.5-40.5T740-704q71 0 108 44t37 128v257h-67l-6-45q-28 25-61.5 39.5T679-266Z" />
            </svg>
          </Toggle>
          <Toggle
            size="sm"
            aria-label="translate"
            disabled={
              !song ||
              song.supportTranslate == false ||
              song.supportTranslate == undefined
            }
            onClick={() => setTranslate((prev: boolean) => !prev)}
            pressed={translate}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              width="20px"
              viewBox="0 -960 960 960"
              fill="#5f6368"
            >
              <path d="m476-80 182-480h84L924-80h-84l-43-122H603L560-80h-84ZM160-200l-56-56 202-202q-35-35-63.5-80T190-640h84q20 39 40 68t48 58q33-33 68.5-92.5T484-720H40v-80h280v-80h80v80h280v80H564q-21 72-63 148t-83 116l96 98-30 82-122-125-202 201Zm468-72h144l-72-204-72 204Z" />
            </svg>
          </Toggle>
        </div>
      </div>
      <div className="w-full py-2 flex flex-row gap-x-6 sm:max-w-[500px]">
        <div className="text-sm w-8">{formatTime(currentTime)}</div>
        <Slider
          defaultValue={[0]}
          value={[(currentTime / duration) * 100]}
          onValueChange={(value) => {
            if (player) {
              player.seekTo((value[0] * duration) / 100, true);
            }
          }}
        />
        <div className="text-sm w-8">{formatTime(duration)}</div>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}
