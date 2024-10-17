"use client";

import { useState, useEffect } from "react";
import { notoSansJP, notoSansTC, notoSansKR } from "@/app/font";
import { cn } from "@/lib/utils";

import { Skeleton } from "./ui/skeleton";

import { Song } from "@/app/type";

interface LyricPanelProps {
  song: Song | null;
}

export default function LyricPanel({ song }: LyricPanelProps) {
  return (
    <div
      className={cn(
        "w-1/2",
        notoSansJP.className,
        notoSansTC.className,
        notoSansKR.className
      )}
    >
      {song ? (
        <div className="flex flex-col gap-4 justify-center items-center w-full">
          <p className="text-lg">
            {song.track} - {song.artist}
          </p>
          <Skeleton className="w-full h-20" />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-full">
          <h1>no lyrics</h1>
        </div>
      )}
    </div>
  );
}
