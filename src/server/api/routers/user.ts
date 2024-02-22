import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ user_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.create({
        data: {
          user_uuid: input.user_id,
        },
      });
    }),

  getUser: publicProcedure
    .input(z.object({ user_id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: {
          user_uuid: input.user_id,
        },
      });
    }),
});
