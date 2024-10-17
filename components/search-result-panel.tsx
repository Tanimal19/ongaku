import { YoutubeVideo } from "@/app/type";

interface SearchResultPanelProps {
  videos: YoutubeVideo[];
  setVIndex: (vIndex: any) => void;
}

export default function SearchResultPanel({
  videos,
  setVIndex,
}: SearchResultPanelProps) {
  return (
    <div className="flex flex-col gap-y-4">
      {videos.map((video, idx) => (
        <div
          onClick={() => {
            console.log(idx);
            setVIndex(idx);
          }}
          key={video.videoId}
          className="flex flex-col gap-y-2 p-2 hover:text-blue-500"
        >
          <h3 className="text-lg">{video.title}</h3>
          <p className="text-sm">{video.channelName}</p>
        </div>
      ))}
    </div>
  );
}
