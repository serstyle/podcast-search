import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FollowPodcastCta from "~/app/_components/follow-podcast";
import { getPodcastByPodcastIdAndUserId } from "~/app/actions/follow-podcast";
import {
  searchEpisodesByPodcastId,
  searchPodcastById,
} from "~/app/actions/podcast";

export default async function Podcast({ params }: { params: { id: string } }) {
  const podcastId = Number(params.id);

  if (isNaN(podcastId)) return notFound();

  const podcast = await searchPodcastById(podcastId);

  if (!podcast || podcast.description === "No feeds match this id.") {
    return notFound();
  }

  const episodes = await searchEpisodesByPodcastId(podcastId);

  const podcastAttachedToUser = await getPodcastByPodcastIdAndUserId(podcastId);

  return (
    <div className="flex flex-col items-center px-4 pb-12 pt-16">
      <div className="absolute left-4 top-4">
        <Link href="/">Go back</Link>
      </div>
      <div className="absolute right-4 top-4">
        {podcast.feed.id && (
          <FollowPodcastCta
            podcastName={podcast.feed.title}
            podcastId={podcast.feed.id}
            isFollow={!!podcastAttachedToUser}
          />
        )}
      </div>
      <div className="mb-4">
        <Image alt="" src={podcast.feed.image} width={200} height={200} />
      </div>
      <h1 className="mb-4 text-xl font-bold">{podcast.feed.title}</h1>
      <p className="mb-4">By : {podcast.feed.author}</p>
      <p className="mb-8 text-sm text-gray-200">{podcast.feed.description}</p>
      {podcast.feed.link && (
        <a
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20 hover:no-underline"
          href={podcast.feed.link}
        >
          Go to the podcast site
        </a>
      )}

      <h2 className="my-8 font-bold">Latest episodes :</h2>
      <ul>
        {episodes.items.map((episode) => (
          <li className="mb-1" key={episode.id}>
            <a target="_blank" href={episode.enclosureUrl}>
              <span>{episode.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
