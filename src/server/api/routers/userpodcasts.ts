import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userPodcastsRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ user_id: z.number(), podcast_id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.assoc_Post_User.create({
        data: {
          user_id: input.user_id,
          podcast_id: input.podcast_id,
        },
      });
    }),
  delete: publicProcedure
    .input(z.object({ relation_id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.assoc_Post_User.delete({
        where: {
          id: input.relation_id,
        },
      });
    }),
  getPodcastsByUser: publicProcedure
    .input(z.object({ user_id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.assoc_Post_User.findMany({
        where: {
          user_id: input.user_id,
        },
      });
    }),
  getByPodcastAndUser: publicProcedure
    .input(z.object({ user_id: z.number(), podcast_id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.assoc_Post_User.findFirst({
        where: {
          AND: {
            user_id: input.user_id,
            podcast_id: input.podcast_id,
          },
        },
      });
    }),
});
