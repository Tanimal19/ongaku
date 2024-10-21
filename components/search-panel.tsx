"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Song } from "@/app/type";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  track: z.string().min(1).max(50),
  artist: z.string().min(1).max(50),
});

interface SearchPanelProps {
  setSearchSong: (_: any) => void;
  setSearchState: (_: any) => void;
}

export default function SearchPanel({
  setSearchSong,
  setSearchState,
}: SearchPanelProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      track: "",
      artist: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSearchSong((prev: Song) => {
      return {
        ...prev,
        track: values.track,
        artist: values.artist,
      };
    });
    setSearchState("search video");
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-row gap-x-4 my-2 px-4"
      >
        <FormField
          control={form.control}
          name="track"
          render={({ field }) => (
            <FormItem className="max-w-[280px]">
              <FormControl>
                <Input placeholder="track name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="artist"
          render={({ field }) => (
            <FormItem className="max-w-[280px]">
              <FormControl>
                <Input placeholder="artist name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="hidden" type="submit"></Button>
      </form>
    </Form>
  );
}
