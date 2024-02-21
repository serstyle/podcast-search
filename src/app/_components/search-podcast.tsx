"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useCallback, useState } from "react";

import { api } from "~/trpc/react";
import { searchPodcastByQuery } from "../actions/podcast";
import { type ApiResponse } from "podcastdx-client/dist/src/types";
import Image from "next/image";
import Link from "next/link";

export function SearchPodcast() {
  const [searchInput, setSearchInput] = useState("");
  const [podcasts, setPodcasts] = useState<ApiResponse.Search | null>(null);

  const searchPodcast = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const podcasts = await searchPodcastByQuery(searchInput);

      setPodcasts(podcasts);
    },
    [searchInput],
  );

  const getTruncatedText = (text: string, length: number) => {
    if (text.length > length) return text.slice(0, length) + "...";
    return text;
  };

  return (
    <div>
      <form onSubmit={searchPodcast} className="mb-8 flex flex-col gap-2">
        <input
          type="text"
          placeholder="Title"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20 hover:no-underline"
        >
          Search
        </button>
      </form>
      {podcasts && (
        <div>
          {podcasts.count > 0 ? (
            podcasts.feeds.map((podcast) => (
              <div key={podcast.id} className="mb-3">
                <Link href={`/podcast/${podcast.id}`}>
                  <div className="flex items-center gap-4">
                    <div className="min-h-20 min-w-20">
                      {podcast.image && (
                        <Image
                          width={"80"}
                          height={"80"}
                          src={podcast.image}
                          alt={podcast.title}
                        />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="mb-2 text-sm">{podcast.title}</p>
                      <p className="text-xs text-gray-300">
                        {getTruncatedText(podcast.author, 80)}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>No podcast found.</p>
          )}
        </div>
      )}
    </div>
  );
}
