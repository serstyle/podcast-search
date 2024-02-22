import Card from "~/components/Card";
import DeleteCta from "./_components/delete-cta";
import { SearchPodcast } from "./_components/search-podcast";

import Link from "next/link";
import Image from "next/image";
import { api } from "~/trpc/server";

export default async function Home() {
  const getUserPodcasts = await api.userPodcasts.getPodcastsByUser.query();
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Search new cool Podcast
      </h1>
      <div className="w-full">
        <div className="mb-8">
          <h3 className="mb-4 font-semibold">Recently followed: </h3>
          {getUserPodcasts && getUserPodcasts.length > 0 ? (
            getUserPodcasts.map((podcast) => (
              <Card key={podcast.id}>
                <div className="flex items-center justify-between gap-4">
                  <Link
                    className="flex flex-grow items-center gap-4"
                    href={`/podcast/${podcast.podcast_external_id}`}
                  >
                    <Image
                      src={podcast.image}
                      alt={podcast.name}
                      width={100}
                      height={100}
                    />

                    <p>{podcast.name}</p>
                  </Link>
                  <DeleteCta id={podcast.podcast_external_id} />
                </div>
              </Card>
            ))
          ) : (
            <p>You are not following any podcast yet.</p>
          )}
        </div>

        <SearchPodcast />
      </div>
    </div>
  );
}
