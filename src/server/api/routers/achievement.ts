import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";


export const achievementRouter = router({
  getAchievements: publicProcedure
    .input(z.object({ achievement_id: z.string() }))
    .query(async ({ input, ctx }) => {
      const achievements = await ctx.prisma.profile_achievement.findUnique({
        where: {
          achievement_id: input.achievement_id,
        },
      });

      return achievements;
    }),

  createAchievement: protectedProcedure
    .input(
      z.object({
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

// export const achievementRouter = router({
//   listUserAchievement: protectedProcedure
//     .input(z.object({ user_id: z.string() }))
//     .query(async ({ ctx, input }) => {
//       // Fetch achievement records for a specific user
//       const achievements = await ctx.prisma.profile_achievement.findMany({
//         where: {
//           user_id: input.user_id,
//         },
//       });

//       return achievements;
//     }),

//   createAchievement: protectedProcedure
//     .input(
//       z.object({
//         user_id: z.string(),
//         title: z.string(),
//         received_year: z.string(),
//         description: z.string().nullable(),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {
//       // Create a new achievement record for a user
//       const newAchievement = await ctx.prisma.profile_achievement.create({
//         data: {
//           user_id: input.user_id,
//           title: input.title,
//           received_year: input.received_year,
//           description: input.description,
//         },
//       });

//       return newAchievement;
//     }),

//   updateAchievement: protectedProcedure
//     .input(
//       z.object({
//         achievement_id: z.string(),
//         title: z.string(),
//         received_year: z.string(),
//         description: z.string().nullable(),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {
//       // Update an existing achievement record
//       const updatedAchievement = await ctx.prisma.profile_achievement.update({
//         where: {
//           achievement_id: input.achievement_id,
//         },
//         data: {
//           title: input.title,
//           received_year: input.received_year,
//           description: input.description,
//         },
//       });

//       return updatedAchievement;
//     }),

//   deleteAchievement: protectedProcedure
//     .input(z.object({ achievement_id: z.string() }))
//     .mutation(async ({ input, ctx }) => {
//       // Delete an achievement record
//       await ctx.prisma.profile_achievement.delete({
//         where: {
//           achievement_id: input.achievement_id,
//         },
//       });

//       return { success: true };
//     }),
// });

