import { z } from "zod";
import { router, protectedProcedure } from "~/server/api/trpc";

import { TRPCError } from "@trpc/server";

export const templateRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      const templates = await ctx.prisma.phase_template.findMany({
        where: {
          user_id: ctx.user.id,
        },
      });

      return templates;
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching templates",
      });
    }
  }),

  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const template = await ctx.prisma.phase_template.findUnique({
        where: {
          id: input.id,
        },
      });
      return template;
    }),

  create: protectedProcedure
    .input(
      z.object({
        comment_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const reaction = await ctx.prisma.reaction.create({
        data: {
          ...input,
          user_id: "b9f96aea-9a6d-4fbb-bb48-b5285894a743",
        },
      });

      return reaction;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        comment_id: z.string(),
        user_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const reaction = await ctx.prisma.reaction.delete({
        where: {
          comment_id_user_id: {
            comment_id: input.comment_id,
            user_id: input.user_id,
          },
        },
      });

      return reaction;
    }),
});
