import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FollowPodcastCta from "~/app/_components/follow-podcast";
import { getPodcastByPodcastIdAndUserId } from "~/app/actions/follow-podcast";

import {
  searchEpisodesByPodcastId,
  searchPodcastById,
} from "~/app/actions/podcast";
import Card from "~/components/Card";
import { ChevronLeftIcon } from "~/components/Icon/Chevron";
import PlayIcon from "~/components/Icon/Play";
import { prettyTime } from "~/utils";

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
    <div className="flex flex-col px-4 pb-12 pt-16">
      <div className="absolute left-4 top-4">
        <Link href="/">
          <div className="flex">
            <ChevronLeftIcon />
            Go back
          </div>
        </Link>
      </div>
      <div className="mb-12 flex">
        <Image
          alt=""
          className="h-32 w-32 md:h-52 md:w-52"
          src={podcast.feed.image}
          width={200}
          height={200}
        />
        <div className="ml-4 flex flex-col justify-end">
          <h1 className="mb-4 text-xl font-bold">{podcast.feed.title}</h1>
          <p className="text-sm">{podcast.feed.author}</p>
        </div>
      </div>
      <div className="mb-12">
        {podcast.feed.id && (
          <FollowPodcastCta
            podcastName={podcast.feed.title}
            podcastId={podcast.feed.id}
            podcastImage={podcast.feed.image}
            isFollow={!!podcastAttachedToUser}
          />
        )}
      </div>
      <div>
        <p className="mb-2 text-lg font-bold">About</p>
        <p className="mb-8 text-sm text-gray-200">{podcast.feed.description}</p>
      </div>
      {podcast.feed.link && (
        <a
          className="w-80 rounded-full bg-white/10 px-10 py-3 text-center font-semibold transition hover:bg-white/20 hover:no-underline"
          href={podcast.feed.link}
        >
          Go to the podcast site
        </a>
      )}

      <h2 className="my-8 font-bold">Latest episodes :</h2>
      <div>
        {episodes.items.map((episode) => (
          <Card key={episode.id}>
            <a target="_blank" href={episode.enclosureUrl}>
              <div className="flex items-center gap-4">
                <div className="min-h-20 min-w-20">
                  {episode.feedImage && (
                    <Image
                      width={"80"}
                      height={"80"}
                      src={episode.feedImage}
                      alt={episode.title}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <p className="mb-2 text-sm">{episode.title}</p>
                  <p className="text-xs text-gray-300">
                    {episode.datePublishedPretty} -{" "}
                    {prettyTime(episode.duration)}
                  </p>
                </div>
                <div className="ml-auto">
                  <PlayIcon />
                </div>
              </div>
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}
