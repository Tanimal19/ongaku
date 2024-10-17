interface SyncLyricDisplayProps {
  lyrics: {
    "start-time": string;
    "end-time": string;
  }[];
}

export default function SyncLyricDisplay(lyrics: any) {
  return (
    <div>
      <h1>LyricDisplay</h1>
    </div>
  );
}
