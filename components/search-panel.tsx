"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Song } from "@/app/type";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  track: z.string().min(1).max(50),
  artist: z.string().min(1).max(50),
});

interface SearchPanelProps {
  setSong: (song: any) => void;
  setIsSearching: (isSearching: any) => void;
}

export default function SearchPanel({
  setSong,
  setIsSearching,
}: SearchPanelProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      track: "",
      artist: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSong((prev: Song) => {
      return {
        ...prev,
        track: values.track,
        artist: values.artist,
      };
    });
    setIsSearching(true);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-row gap-x-4"
      >
        <FormField
          control={form.control}
          name="track"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="track name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="artist"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="artist name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Search</Button>
      </form>
    </Form>
  );
}
