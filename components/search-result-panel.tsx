import { YoutubeVideo } from "@/app/type";

interface SearchResultPanelProps {
  videos: YoutubeVideo[];
  setVIndex: (_: any) => void;
}

export default function SearchResultPanel({
  videos,
  setVIndex,
}: SearchResultPanelProps) {
  return (
    <div className="flex flex-col my-4 gap-y-4 h-full overflow-y-scroll">
      {videos.map((video, idx) => (
        <div
          onClick={() => setVIndex(idx)}
          key={video.videoId}
          className="flex flex-col gap-y-2 p-2 hover:opacity-60"
        >
          <p className="text-base">{video.title}</p>
          <p className="text-sm">{video.channelName}</p>
        </div>
      ))}
    </div>
  );
}
