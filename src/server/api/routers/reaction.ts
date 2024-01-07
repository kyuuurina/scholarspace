import { z } from "zod";
import { router, protectedProcedure } from "~/server/api/trpc";

export const reactionRouter = router({
  listbyCommentId: protectedProcedure
    .input(
      z.object({
        comment_id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const reactions = await ctx.prisma.reaction.findMany({
        where: {
          comment_id: input.comment_id,
        },
      });
      return reactions;
    }),

  getByCommentAndUserId: protectedProcedure
    .input(
      z.object({
        comment_id: z.string(),
        user_id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const reaction = await ctx.prisma.reaction.findUnique({
        where: {
          comment_id_user_id: {
            comment_id: input.comment_id,
            user_id: input.user_id,
          },
        },
      });
      return reaction;
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
