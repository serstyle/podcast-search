"use server";

import { cookies } from "next/headers";
import { api } from "~/trpc/server";

export const followPodcast = async (
  podcast: { podcast_external_id: number; name: string; image: string },
  user_id?: number,
) => {
  if (!user_id) {
    return;
  }
  const podcastByExternalId = await api.podcast.getPodcast.query({
    podcast: podcast.podcast_external_id,
  });

  let podcastId = podcastByExternalId?.id;
  if (!podcastId) {
    const res = await api.podcast.create.mutate({
      name: podcast.name,
      podcast_external_id: podcast.podcast_external_id,
      image: podcast.image,
    });
    podcastId = res.id;
  }

  const isAlreadyFollowed = await api.userPodcasts.getByPodcastAndUser.query({
    podcast_id: podcastId,
    user_id: user_id,
  });
  if (!!isAlreadyFollowed) return;

  return await api.userPodcasts.create.mutate({
    user_id,
    podcast_id: podcastId,
  });
};
export const unFollowPodcast = async (podcast_external_id: number) => {
  const podcastRelation =
    await getPodcastByPodcastIdAndUserId(podcast_external_id);

  if (!podcastRelation?.id) {
    return;
  }
  return await api.userPodcasts.delete.mutate({
    relation_id: podcastRelation.id,
  });
};

export const getPodcastByPodcastIdAndUserId = async (external_id: number) => {
  const userCookie = cookies().get("userId");
  if (!userCookie) return;
  const user = await api.user.getUser.query({ user_id: userCookie.value });
  const userId = user?.id;
  if (!userId) return;

  const podcastByExternalId = await api.podcast.getPodcast.query({
    podcast: external_id,
  });
  if (!podcastByExternalId?.id) return;
  return await api.userPodcasts.getByPodcastAndUser.query({
    podcast_id: podcastByExternalId.id,
    user_id: user.id,
  });
};

export const getPodcastsByUserId = async () => {
  const userCookie = cookies().get("userId");
  if (!userCookie) return;
  const user = await api.user.getUser.query({ user_id: userCookie.value });
  const userId = user?.id;
  if (!userId) return;

  const podcasts_relation = await api.userPodcasts.getPodcastsByUser.query({
    user_id: userId,
  });
  const podcastsId = podcasts_relation.map((p) => p.podcast_id);
  const podcasts = await api.podcast.getByIds.query({
    ids: podcastsId,
  });
  return podcasts;
};
