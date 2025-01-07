"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect, useContext } from "react";
import { Song, YoutubeVideo } from "@/lib/type";
import { searchYoutubeVideo, getLyrics } from "@/lib/api";
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
import SearchResult from "@/components/player/search-result";
import {
  playerContext,
  songContext,
  statusContext,
} from "@/components/player/main-panel";
import Icon from "@/components/icon";
import { Skeleton } from "../ui/skeleton";

const formSchema = z.object({
  track: z.string().min(1),
  artist: z.string().optional(),
  addition: z.string().optional(),
});

export default function SearchDialog() {
  const p = useContext(playerContext);
  const [player] = p;
  const s = useContext(songContext);
  const [, setSong] = s;
  const st = useContext(statusContext);
  const [status, setStatus] = st;

  const [lyricInfo, setLyricInfo] = useState({
    track: "",
    artist: "",
  });
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [vIndex, setVIndex] = useState<number | null>(null);

  // set form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      track: "",
      artist: "",
      addition: "",
    },
  });

  // when form submit
  function onSubmit(values: z.infer<typeof formSchema>) {
    setStatus("searching");
    setLyricInfo({
      track: values.track,
      artist: values.artist ? values.artist : "",
    });

    searchYoutubeVideo(
      `${values.track} ${values.artist} ${values.addition}`
    ).then((videos: YoutubeVideo[] | null) => {
      if (videos) {
        setVideos(videos);
      } else {
        setVideos([]);
      }
      setStatus("fetching");
    });

    form.reset();
  }

  useEffect(() => {
    if (vIndex != null && lyricInfo.track != "") {
      setSong(null);
      setVIndex(null);
      getLyrics(lyricInfo.track, lyricInfo.artist, videos[vIndex]).then(
        (song: Song | null) => {
          if (song) {
            setVIndex(null);
            setVideos([]);
            setSong(song);
            player?.stopVideo();
            setStatus("display");
          }
        }
      );
    }
  }, [vIndex]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Icon id="search" className="h-8 w-8 p-1 rounded-sm hover:bg-muted" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg overflow-hidden rounded-lg flex flex-col">
        <DialogHeader className="my-4">
          <DialogTitle>Youtube 歌曲搜尋</DialogTitle>
          <DialogDescription>
            <span>請儘量用原文名稱來提高歌詞抓取的準確性，</span>
            <br />
            <span>例如用「夜に駆ける」而不是「yorunikakeru」</span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            autoComplete="off"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-2 items-center w-full"
          >
            <div className="flex flex-col sm:flex-row gap-2">
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
                      <Input placeholder="原唱名稱 (選填)" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="addition"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="額外資訊 (選填)" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button
              className="w-full max-w-[200px] sm:max-w-none"
              type="submit"
            >
              搜尋
            </Button>
          </form>
        </Form>
        {status == "searching" ? (
          <div className="flex flex-col items-center">
            <Skeleton className="w-[60%] h-8" />
          </div>
        ) : (
          <div>
            {status == "fetching" ? (
              <div className="w-full">
                {videos.length > 0 ? (
                  <DialogClose className="w-full">
                    <SearchResult videos={videos} setVIndex={setVIndex} />
                  </DialogClose>
                ) : (
                  <div>搜尋出了點問題</div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
