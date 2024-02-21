import DeleteCta from "./_components/delete-cta";
import { SearchPodcast } from "./_components/search-podcast";
import { getPodcastsByUserId } from "./actions/follow-podcast";
import Link from "next/link";

export default async function Home() {
  const getUserPodcasts = await getPodcastsByUserId();
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Search new cool Podcast
      </h1>
      <div className="w-full max-w-xs">
        <div className="mb-8">
          <h3 className="mb-4 font-semibold">Recently followed: </h3>
          {getUserPodcasts && getUserPodcasts.length > 0 ? (
            getUserPodcasts.map((podcast) => (
              <div key={podcast.id} className="mb-2 flex items-center gap-4">
                <Link href={`/podcast/${podcast.podcast_external_id}`}>
                  {podcast.name}
                </Link>
                <DeleteCta id={podcast.podcast_external_id} />
              </div>
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
