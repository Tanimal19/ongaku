import { YoutubeVideo } from "@/app/type";

interface SearchResultPanelProps {
  videos: YoutubeVideo[];
  setVIndex: (_: any) => void;
}

export default function SearchResult({
  videos,
  setVIndex,
}: SearchResultPanelProps) {
  return (
    <div className="flex flex-col my-4 w-full h-fit">
      {videos.map((video, idx) => (
        <div
          onClick={() => setVIndex(idx)}
          key={video.videoId}
          className="flex flex-col py-2 px-4 text-left hover:bg-pink-100 cursor-pointer outline-stone-200"
        >
          <p className="w-full text-base text-ellipsis overflow-hidden whitespace-nowrap">
            {video.title}
          </p>
          <p className="text-xs">{video.channelName}</p>
        </div>
      ))}
    </div>
  );
}
