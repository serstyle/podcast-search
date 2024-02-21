import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { podcastRouter } from "./routers/podcast";
import { userRouter } from "./routers/user";
import { userPodcastsRouter } from "./routers/userpodcasts";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  podcast: podcastRouter,
  user: userRouter,
  userPodcasts: userPodcastsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
