import { Song } from "@/app/type";

import { Toggle } from "@/components/ui/toggle";

interface LyricPanelConfigProps {
  song: Song | null;
  setSync: (_: any) => void;
  setTranslate: (_: any) => void;
  setRomaji: (_: any) => void;
}

export default function LyricPanelConfig({
  song,
  setSync,
  setTranslate,
  setRomaji,
}: LyricPanelConfigProps) {
  return (
    <div className="flex flex-row gap-x-1 justify-end">
      <Toggle
        size="sm"
        aria-label="sync"
        disabled={
          !song || song.supportSync == false || song.supportSync == undefined
        }
        onClick={() => setSync((prev: boolean) => !prev)}
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
  );
}
