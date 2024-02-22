import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type db } from "~/server/db";

interface Context {
  headers: Headers;
  db: typeof db;
}

const getUserId = async (ctx: Context) => {
  const cookie = ctx.headers.get("cookie")?.split("userId=")[1]?.split(";")[0];
  if (!cookie) return null;
  return await ctx.db.user.findUnique({
    where: {
      user_uuid: cookie,
    },
  });
};

const getRelationUserPodcast = async (
  ctx: Context,
  input: { external_id: number },
  userId: number,
) => {
  const podcastId = await ctx.db.podcast.findUnique({
    where: {
      podcast_external_id: input.external_id,
    },
  });
  if (!podcastId) return;
  return ctx.db.assoc_Post_User.findFirst({
    where: {
      AND: {
        user_id: userId,
        podcast_id: podcastId.id,
      },
    },
  });
};

export const userPodcastsRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        podcast_external_id: z.number(),
        podcast_name: z.string(),
        podcast_image: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getUserId(ctx);
      if (!user) return;
      const podcastByExternalId = await ctx.db.podcast.findUnique({
        where: {
          podcast_external_id: input.podcast_external_id,
        },
      });

      let podcastId = podcastByExternalId?.id;
      if (!podcastId) {
        const res = await ctx.db.podcast.create({
          data: {
            name: input.podcast_name,
            podcast_external_id: input.podcast_external_id,
            image: input.podcast_image,
          },
        });
        podcastId = res.id;
      }

      return ctx.db.assoc_Post_User.create({
        data: {
          user_id: user.id,
          podcast_id: podcastId,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ external_id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const user = await getUserId(ctx);
      if (!user) return;
      const relationId = await getRelationUserPodcast(ctx, input, user.id);
      if (!relationId) return;
      return ctx.db.assoc_Post_User.delete({
        where: {
          id: relationId.id,
        },
      });
    }),

  getPodcastsByUser: publicProcedure.query(async ({ ctx }) => {
    const user = await getUserId(ctx);
    if (!user) return [];
    const podcastsRelation = await ctx.db.assoc_Post_User.findMany({
      where: {
        user_id: user.id,
      },
    });
    const podcastsId = podcastsRelation.map((p) => p.podcast_id);
    const podcasts = await ctx.db.podcast.findMany({
      where: {
        id: {
          in: podcastsId,
        },
      },
    });
    return podcasts;
  }),

  getByPodcastAndUser: publicProcedure
    .input(z.object({ external_id: z.number() }))
    .query(async ({ ctx, input }) => {
      const user = await getUserId(ctx);
      if (!user) return;
      const relation = await getRelationUserPodcast(ctx, input, user.id);
      return relation;
    }),
});
