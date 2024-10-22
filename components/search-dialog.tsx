"use client";

import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect, useContext } from "react";

import { Song, YoutubeVideo } from "@/app/type";
import { searchYoutubeVideo, getLyrics } from "@/app/api";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchResult from "@/components/search-result";
import { timeContext } from "@/components/main-panel";

const formSchema = z.object({
  track: z.string().min(1),
  artist: z.string().min(1),
});

interface SearchPanelProps {
  setSong: (_: any) => void;
}

export default function SearchDialog({ setSong }: SearchPanelProps) {
  const p = useContext(timeContext);
  const [player, _] = p;
  const [formInput, setFormInput] = useState({ track: "", artist: "" });
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [vIndex, setVIndex] = useState<number | null>(null);

  // set form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      track: "",
      artist: "",
    },
  });

  // if form submit, search video
  function onSubmit(values: z.infer<typeof formSchema>) {
    setFormInput(values);

    searchYoutubeVideo(`${values.track} ${values.artist}`).then(
      (videos: YoutubeVideo[] | null) => {
        if (videos) {
          setVideos(videos);
        }
      }
    );

    form.reset();
  }

  useEffect(() => {
    if (vIndex != null && formInput.track != "" && formInput.artist != "") {
      setSong(null);
      setVIndex(null);
      getLyrics(formInput.track, formInput.artist, videos[vIndex]).then(
        (song: Song | null) => {
          if (song) {
            setVIndex(null);
            setVideos([]);
            setSong(song);
            player?.stopVideo();
          }
        }
      );
    }
  }, [vIndex]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="p-1 rounded-lg hover:bg-muted">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            width="24px"
            viewBox="0 -960 960 960"
            fill="#000000"
          >
            <path d="M765-144 526-383q-30 22-65.79 34.5-35.79 12.5-76.18 12.5Q284-336 214-406t-70-170q0-100 70-170t170-70q100 0 170 70t70 170.03q0 40.39-12.5 76.18Q599-464 577-434l239 239-51 51ZM384-408q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z" />
          </svg>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md overflow-hidden rounded-lg flex flex-col">
        <DialogHeader className="my-4">
          <DialogTitle>Youtube 歌曲搜尋</DialogTitle>
          <DialogDescription>
            <p>請儘量用原文名稱來提高歌詞抓取的準確性，</p>
            <p>例如用「光れ - あたらよ」而不是「hikare - atarayo」</p>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            autoComplete="off"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-2 items-center w-full"
          >
            <div className="flex flex-row gap-x-2">
              <FormField
                control={form.control}
                name="track"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="歌曲名稱" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="artist"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="歌手名稱" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button className="w-full" type="submit">
              搜尋
            </Button>
          </form>
        </Form>
        {videos.length > 0 ? (
          <DialogClose>
            <SearchResult videos={videos} setVIndex={setVIndex} />
          </DialogClose>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
