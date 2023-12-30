import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";


export const achievementRouter = router({
  getAchievements: publicProcedure
    .input(z.object({ profile_id: z.string() }))
    .query(async ({ input, ctx }) => {
      const achievements = await ctx.prisma.profile_achievement.findMany({
        where: {
          // achievement_id: input.achievement_id,
          profile_id: input.profile_id,
        },
      });

      return achievements;
    }),

  
    get: publicProcedure
    .input(z.object({ profile_id: z.string() }))
    .query(async ({ input, ctx }) => {
      // Ensure that the requesting user has permission to view education for the given profile_id
      const userProfile = await ctx.prisma.profile.findUnique({
        where: {
          profile_id: input.profile_id,
        },
        select: {
          profile_id: true,
        },
      });

      if (!userProfile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User profile not found.",
        });
      }

      // Fetch the education records for the given profile_id
      const achievements = await ctx.prisma.profile_achievement.findMany({
        where: {
          profile_id: input.profile_id,
        },
      });

      return achievements;
    }),

  createAchievement: protectedProcedure
    .input(
      z.object({
        profile_id: z.string(),
        title: z.string(),
        received_year: z.string(),
        description: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const newAchievement = await ctx.prisma.profile_achievement.create({
        data: {
          user_id: ctx.user.id,
          ...input,
        },
      });

      return newAchievement;
    }),

    updateAchievement: protectedProcedure
    .input(
      z.object({
        // profile_id: z.string(),
        achievement_id: z.string(),
        title: z.string(),
        received_year: z.string(),
        description: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { achievement_id, title, received_year, description} = input;
  
      const achievement = await ctx.prisma.profile_achievement.findUnique({
        where: {
          achievement_id,
        },
      });
  
      if (!achievement || achievement.user_id !== ctx.user.id) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update this achievement.",
        });
      }
  
      const updatedAchievement = await ctx.prisma.profile_achievement.update({
        where: {
          achievement_id,
        },
        data: {
          title,
          received_year,
          description,
        },
      });
  
      return updatedAchievement;
    }),
  
  //delete achievement procedure
  deleteAchievement: protectedProcedure
    .input(z.object({ achievement_id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { achievement_id } = input;

      const achievement = await ctx.prisma.profile_achievement.findUnique({
        where: {
          achievement_id,
        },
      });

      if (!achievement || achievement.user_id !== ctx.user.id) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete this achievement.",
        });
      }

      await ctx.prisma.profile_achievement.delete({
        where: {
          achievement_id,
        },
      });

      return { success: true };
    }),
});

