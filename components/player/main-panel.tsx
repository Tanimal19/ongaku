"use client";

import { useState, createContext, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { getPanelElement } from "react-resizable-panels";
import { Song } from "@/lib/type";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import LyricPanel from "@/components/player/lyric-panel";
import VideoPanel from "@/components/player/video-panel";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/icon";
import SearchDialog from "@/components/player/search-dialog";

export const playerContext = createContext<
  [YT.Player | null, (_: YT.Player) => void]
>([null, () => {}]);

export const songContext = createContext<[Song | null, (_: any) => void]>([
  null,
  () => {},
]);

export const statusContext = createContext<[string, (_: any) => void]>([
  "idle",
  () => {},
]);

export const mobileContext = createContext<boolean>(false);

export default function MainPanel() {
  const [player, setPlayer] = useState<YT.Player | null>(null);
  const [song, setSong] = useState<Song | null>(null);
  const [status, setStatus] = useState<string>("idle");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const mediaQuery = useMediaQuery({ query: "(max-width: 640px)" });

  // because mediaQuery changed dynamic, will cause render error
  useEffect(() => {
    setIsMobile(mediaQuery);
  }, [mediaQuery]);

  const [resizableWidth, setresizableWidth] = useState<number>(0);

  return (
    <mobileContext.Provider value={isMobile}>
      <playerContext.Provider value={[player, setPlayer]}>
        <songContext.Provider value={[song, setSong]}>
          <statusContext.Provider value={[status, setStatus]}>
            <div className="h-screen flex flex-col">
              <div className="bg-zinc-50 w-full h-12 py-2 px-6 flex flex-row justify-between items-center border-b">
                <Link href="/">
                  <Image
                    src="/logo-full.svg"
                    width={120}
                    height={40}
                    alt="logo"
                  />
                </Link>
                <div className="flex flex-row items-center gap-4">
                  <SearchDialog />
                  <Link href="/about">
                    <Icon
                      id="help"
                      className="h-8 w-8 p-1 rounded-sm hover:bg-muted"
                    />
                  </Link>
                </div>
              </div>
              <main className="flex-1 overflow-auto">
                {isMobile ? (
                  <div className="max-w-screen max-h-full flex flex-col">
                    <div className="w-screen sticky top-0">
                      <VideoPanel wrapperWidth={null} />
                    </div>
                    <LyricPanel />
                  </div>
                ) : (
                  <div className="max-w-screen max-h-full flex flex-col">
                    <ResizablePanelGroup
                      direction="horizontal"
                      className="w-full"
                    >
                      <ResizablePanel
                        className="mt-6"
                        id="video-panel"
                        onResize={() => {
                          const videoPanel = getPanelElement("video-panel");
                          if (videoPanel)
                            setresizableWidth(videoPanel.offsetWidth);
                        }}
                        defaultSize={45}
                        collapsible={true}
                        minSize={20}
                        collapsedSize={0}
                      >
                        <VideoPanel wrapperWidth={resizableWidth} />
                      </ResizablePanel>
                      <ResizableHandle
                        className="h-[100vh] border-2"
                        withHandle
                      />
                      <ResizablePanel
                        className="!overflow-y-scroll mt-6"
                        defaultSize={55}
                        minSize={45}
                      >
                        <LyricPanel />
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  </div>
                )}
              </main>
            </div>
          </statusContext.Provider>
        </songContext.Provider>
      </playerContext.Provider>
    </mobileContext.Provider>
  );
}
