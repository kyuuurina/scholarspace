import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const researchInterestRouter = router({
  listAll: publicProcedure.query(async ({ ctx }) => {
    const research_interests = await ctx.prisma.research_interest.findMany();
    return research_interests;
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // check if input exists in database, if exist, return error
      // turn input into lowercase first
      const name = input.name.toLowerCase();
      const research_interest = await ctx.prisma.research_interest.findUnique({
        where: {
          name,
        },
      });
      if (research_interest) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Research interest already exists",
        });
      }
      // create research interest
      const newResearchInterest = await ctx.prisma.research_interest.create({
        data: {
          name,
        },
      });
      return newResearchInterest;
    }),
});
