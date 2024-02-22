"use client";

import Image from "next/image";
import Link from "next/link";
import Card from "~/components/Card";
import { api } from "~/trpc/react";
import DeleteCta from "./delete-cta";

const FollowedList = () => {
  const getUserPodcasts = api.userPodcasts.getPodcastsByUser.useQuery();
  const isFollowPodcasts =
    getUserPodcasts.data && getUserPodcasts.data.length > 0;
  return (
    <div className="mb-8">
      <h3 className="mb-4 font-semibold">Recently followed: </h3>

      {getUserPodcasts.isInitialLoading ? (
        ""
      ) : isFollowPodcasts ? (
        getUserPodcasts.data.map((podcast) => (
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
  );
};

export default FollowedList;
