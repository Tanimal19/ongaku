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
      <statusContext.Provider value={[status, setStatus]}>
        <playerContext.Provider value={[player, setPlayer]}>
          <songContext.Provider value={[song, setSong]}>
            {isMobile ? (
              <div className="max-w-screen max-h-screen flex flex-col">
                <div className="w-screen sticky top-0">
                  <VideoPanel wrapperWidth={null} />
                </div>
                <LyricPanel />
              </div>
            ) : (
              <div className="max-w-screen max-h-screen flex flex-col">
                <ResizablePanelGroup direction="horizontal" className="w-full">
                  <ResizablePanel
                    className="mt-6"
                    id="video-panel"
                    onResize={() => {
                      const videoPanel = getPanelElement("video-panel");
                      if (videoPanel) setresizableWidth(videoPanel.offsetWidth);
                    }}
                    defaultSize={45}
                    collapsible={true}
                    minSize={20}
                    collapsedSize={0}
                  >
                    <VideoPanel wrapperWidth={resizableWidth} />
                  </ResizablePanel>
                  <ResizableHandle className="h-[80vh] border-2" withHandle />
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
          </songContext.Provider>
        </playerContext.Provider>
      </statusContext.Provider>
    </mobileContext.Provider>
  );
}
