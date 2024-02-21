import { number, z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const podcastRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({ name: z.string().min(1), podcast_external_id: z.number() }),
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return ctx.db.podcast.create({
        data: {
          name: input.name,
          podcast_external_id: input.podcast_external_id,
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.podcast.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  getPodcast: publicProcedure
    .input(z.object({ podcast: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.podcast.findUnique({
        where: {
          podcast_external_id: input.podcast,
        },
      });
    }),

  getByIds: publicProcedure
    .input(z.object({ ids: z.array(number()) }))
    .query(({ ctx, input }) => {
      return ctx.db.podcast.findMany({
        where: {
          id: {
            in: input.ids,
          },
        },
      });
    }),

  deleteOne: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.podcast.delete({ where: { id: input.id } });
    }),
});
