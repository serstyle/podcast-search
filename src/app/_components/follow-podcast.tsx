"use client";

import { useCallback, useMemo } from "react";
import { useAuth } from "~/hooks/useAuth";

import { api } from "~/trpc/react";
interface Props {
  podcastId: number;
  podcastName: string;
  podcastImage: string;
}
const FollowPodcastCta = ({ podcastId, podcastName, podcastImage }: Props) => {
  useAuth();
  const utils = api.useUtils();
  const podcastRelation = api.userPodcasts.getByPodcastAndUser.useQuery({
    external_id: podcastId,
  });
  const isFollow = useMemo(
    () => !!podcastRelation.data,
    [podcastRelation.data],
  );

  const unFollowPodcast = api.userPodcasts.delete.useMutation({
    onSuccess: async () => {
      await utils.userPodcasts.getPodcastsByUser.refetch();
      await utils.userPodcasts.getByPodcastAndUser.refetch();
    },
  });
  const followPodcast = api.userPodcasts.create.useMutation({
    onSuccess: async () => {
      await utils.userPodcasts.getPodcastsByUser.refetch();
      await utils.userPodcasts.getByPodcastAndUser.refetch();
    },
  });

  const toggleFollowPodcast = useCallback(async () => {
    if (isFollow) {
      unFollowPodcast.mutate({ external_id: podcastId });
    } else {
      followPodcast.mutate({
        podcast_external_id: podcastId,
        podcast_name: podcastName,
        podcast_image: podcastImage,
      });
    }
  }, [
    followPodcast,
    isFollow,
    podcastId,
    podcastImage,
    podcastName,
    unFollowPodcast,
  ]);

  return (
    <button
      onClick={toggleFollowPodcast}
      disabled={followPodcast.isLoading || unFollowPodcast.isLoading}
      className={`rounded-full bg-white/20 px-4 py-2 transition hover:bg-white/10 hover:no-underline ${isFollow && "bg-white/40"} disabled:bg-gray-500`}
    >
      {isFollow ? "Following" : "+ Follow"}
    </button>
  );
};

export default FollowPodcastCta;
