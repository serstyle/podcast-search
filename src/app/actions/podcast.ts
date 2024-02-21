"use server";
import PodcastIndexClient from "podcastdx-client";

const client = new PodcastIndexClient({
  key: process.env.PODCAST_INDEX_KEY,
  secret: process.env.PODCAST_INDEX_SECRET,
  disableAnalytics: true,
});
export const searchPodcastByQuery = async (query: string) => {
  const podcasts = await client.search(query);
  return podcasts;
};

export const searchPodcastById = async (id: number) => {
  const podcast = await client.podcastById(id);
  return podcast;
};

export const searchEpisodesByPodcastId = async (id: number) => {
  const episodes = await client.episodesByFeedId(id);
  return episodes;
};
