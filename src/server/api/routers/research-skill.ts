import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const researchSkillRouter = router({
  listAll: publicProcedure.query(async ({ ctx }) => {
    const researchSkills = await ctx.prisma.research_skill.findMany();
    return researchSkills;
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
      const researchSkill = await ctx.prisma.research_skill.findUnique({
        where: {
          name,
        },
      });
      if (researchSkill) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Research skill already exists",
        });
      }
      // create research skill
      const newResearchSkill = await ctx.prisma.research_skill.create({
        data: {
          name,
        },
      });
      return newResearchSkill;
    }),
});
