import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const experienceRouter = router({
  // getExperiences: publicProcedure
  //   .input(z.object({ experience_id: z.string() }))
  //   .query(async ({ input, ctx }) => {
  //     const experiences = await ctx.prisma.profile_experience.findUnique({
  //       where: {
  //         experience_id: input.experience_id,
  //       },
  //     });

  //     return experiences;
  //   }),

  getExperiences: publicProcedure
  .input(z.object({ profile_id: z.string() })) 
  .query(async ({ input, ctx }) => {
    const experiences = await ctx.prisma.profile_experience.findMany({
      where: {
        profile_id: input.profile_id, 
        // education_id: input.education_id,
      },
    });

    return experiences;
  }),

  createExperience: protectedProcedure
    .input(
      z.object({
        profile_id: z.string(),
        title: z.string(),
        start_year: z.string(),
        end_year: z.string(),
        description: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const newExperience = await ctx.prisma.profile_experience.create({
        data: {
          user_id: ctx.user.id,
          ...input,
        },
      });

      return newExperience;
    }),

    updateExperience: protectedProcedure
    .input(
      z.object({
        profile_id: z.string(),
        experience_id: z.string(),
        title: z.string(),
        start_year: z.string(),
        end_year: z.string(),
        description: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { experience_id, title, start_year, end_year, description} = input;
  
      const experience = await ctx.prisma.profile_experience.findUnique({
        where: {
          experience_id,
        },
      });
  
      if (!experience || experience.user_id !== ctx.user.id) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update this experience.",
        });
      }
  
      const updatedExperience = await ctx.prisma.profile_experience.update({
        where: {
          experience_id,
        },
        data: {
          title,
          start_year,
          end_year,
          description,
        },
      });
  
      return updatedExperience;
    }),
  
  //delete experience procedure
  deleteExperience: protectedProcedure
    .input(z.object({ experience_id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { experience_id } = input;

      const experience = await ctx.prisma.profile_experience.findUnique({
        where: {
          experience_id,
        },
      });

      if (!experience || experience.user_id !== ctx.user.id) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete this experience.",
        });
      }

      await ctx.prisma.profile_experience.delete({
        where: {
          experience_id,
        },
      });

      return { success: true };
    }),
});


// import { z } from "zod";
// import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";

// export const experienceRouter = router({
//   listUserAchievements: protectedProcedure
//     .input(z.object({ user_id: z.string() }))
//     .query(async ({ ctx, input }) => {
//       // Fetch experience records for a specific user
//       const experiences = await ctx.prisma.profile_experience.findMany({
//         where: {
//           user_id: input.user_id,
//         },
//       });

//       return experiences;
//     }),

//   createExperience: protectedProcedure
//     .input(
//       z.object({
//         user_id: z.string(),
//         title: z.string(),
//         start_year: z.string(),
//         end_year: z.string(),
//         description: z.string().nullable(),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {
//       // Create a new experience record for a user
//       const newExperience = await ctx.prisma.profile_experience.create({
//         data: {
//           user_id: input.user_id,
//           title: input.title,
//           start_year: input.start_year,
//           end_year: input.end_year,
//           description: input.description,
//         },
//       });

//       return newExperience;
//     }),

//   updateExperience: protectedProcedure
//     .input(
//       z.object({
//         experience_id: z.string(),
//         title: z.string(),
//         start_year: z.string(),
//         end_year: z.string(),
//         description: z.string().nullable(),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {
//       // Update an existing experience record
//       const updatedExperience = await ctx.prisma.profile_experience.update({
//         where: {
//           experience_id: input.experience_id,
//         },
//         data: {
//           title: input.title,
//           start_year: input.start_year,
//           end_year: input.end_year,
//           description: input.description,
//         },
//       });

//       return updatedExperience;
//     }),

//   deleteExperience: protectedProcedure
//     .input(z.object({ experience_id: z.string() }))
//     .mutation(async ({ input, ctx }) => {
//       // Delete an experience record
//       await ctx.prisma.profile_experience.delete({
//         where: {
//           experience_id: input.experience_id,
//         },
//       });

//       return { success: true };
//     }),
// });
