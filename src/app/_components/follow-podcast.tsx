"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "~/hooks/useAuth";
import { followPodcast, unFollowPodcast } from "../actions/follow-podcast";
import { useRouter } from "next/navigation";

interface Props {
  podcastId: number;
  podcastName: string;
  podcastImage: string;
  isFollow: boolean;
}
const FollowPodcastCta = ({
  podcastId,
  podcastName,
  podcastImage,
  isFollow,
}: Props) => {
  const user = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(false);
  }, []);
  const toggleFollowPodcast = useCallback(async () => {
    setLoading(true);
    if (isFollow) {
      await unFollowPodcast(podcastId);
    } else {
      await followPodcast(
        {
          podcast_external_id: podcastId,
          name: podcastName,
          image: podcastImage,
        },
        user?.id,
      );
    }
    router.refresh();
    setLoading(false);
  }, [isFollow, podcastId, podcastImage, podcastName, router, user?.id]);

  return (
    <button
      onClick={toggleFollowPodcast}
      disabled={loading}
      className={`rounded-full bg-white/20 px-4 py-2 transition hover:bg-white/10 hover:no-underline ${isFollow && "bg-white/40"} disabled:bg-gray-500`}
    >
      {isFollow ? "Following" : "+ Follow"}
    </button>
  );
};

export default FollowPodcastCta;
