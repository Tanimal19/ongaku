"use client";

import { use, useContext, useEffect, useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  mobileContext,
  playerContext,
  songContext,
} from "@/components/main-panel";
import Icon from "@/components/icon";

interface ControlPanelProps {
  props: {
    sync: boolean;
    setSync: (_: any) => void;
    translate: boolean;
    setTranslate: (_: any) => void;
    romaji: boolean;
    setRomaji: (_: any) => void;
  };
}

export default function ControlPanel({ props }: ControlPanelProps) {
  const p = useContext(playerContext);
  const [player] = p;
  const s = useContext(songContext);
  const [song] = s;
  const isMobile = useContext(mobileContext);

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
        {/* {song ? (
          <div className="flex-1">
            <p className="line-clamp-1 font-bold text-lg max-w-[60%]">
              {song.title}
            </p>
          </div>
        ) : (
          <p className="flex-1 line-clamp-1 font-bold opacity-40 text-lg">
            沒有音樂正在撥放
          </p>
        )} */}
        <div className="flex-1"></div>

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
          {isPlaying ? (
            <Icon id="pause" className="w-8 h-8" />
          ) : (
            <Icon id="play" className="w-8 h-8" />
          )}
        </div>
        <div className="flex-1 inline-flex justify-end">
          {isMobile ? (
            <DropdownSettingMenu props={props} />
          ) : (
            <LyricToggle props={props} />
          )}
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

function LyricToggle({ props }: ControlPanelProps) {
  const p = useContext(playerContext);
  const [player] = p;
  const s = useContext(songContext);
  const [song] = s;
  const [changeOffset, setChangeOffset] = useState<boolean>(false);

  useEffect(() => {
    setChangeOffset(false);
  }, [song?.videoId]);

  // change offset
  useEffect(() => {
    if (changeOffset) {
      player?.seekTo(0, true);
      player?.playVideo();
    } else {
      if (player) {
        const offset = player.getCurrentTime() - 0.5;

        if (offset >= 0 && song?.syncedLyrics[song.lang]) {
          const prevOffset = parseFloat(
            song.syncedLyrics[song.lang][0]["start"]
          );

          song.syncedLyrics[song.lang].forEach((line) => {
            line["start"] = (
              parseFloat(line["start"]) -
              prevOffset +
              offset
            ).toString();
          });

          player.pauseVideo();
        }
      }
    }
  }, [changeOffset]);

  return (
    <div className="w-fit flex flex-row gap-x-1">
      <Toggle
        size="sm"
        aria-label="sync"
        disabled={
          !song || song.supportSync == false || song.supportSync == undefined
        }
        onClick={() => props.setSync((prev: boolean) => !prev)}
        pressed={props.sync}
      >
        <Icon id="sync" />
      </Toggle>
      <Toggle
        size="sm"
        aria-label="romaji"
        disabled={
          !song ||
          song.supportRomaji == false ||
          song.supportRomaji == undefined
        }
        onClick={() => props.setRomaji((prev: boolean) => !prev)}
        pressed={props.romaji}
      >
        <Icon id="romaji" />
      </Toggle>
      <Toggle
        size="sm"
        aria-label="translate"
        disabled={
          !song ||
          song.supportTranslate == false ||
          song.supportTranslate == undefined
        }
        onClick={() => props.setTranslate((prev: boolean) => !prev)}
        pressed={props.translate}
      >
        <Icon id="translate" />
      </Toggle>
      <Toggle
        size="sm"
        aria-label="offset"
        disabled={!song || !props.sync}
        onClick={() => setChangeOffset((prev) => !prev)}
        pressed={changeOffset}
      >
        <Icon id="timer" />
      </Toggle>
      {changeOffset ? (
        <div className="z-50 w-[320px] flex flex-col justify-center items-center fixed bg-zinc-100/50 backdrop-blur-md rounded-md p-2 shadow-md -translate-y-[80px] -translate-x-[120px]">
          <strong>請在聽到第一句歌詞時再按一次校正按鈕</strong>
        </div>
      ) : null}
    </div>
  );
}

function DropdownSettingMenu({ props }: ControlPanelProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <Icon id="setting" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit -translate-y-[20px]">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <LyricToggle props={props} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
