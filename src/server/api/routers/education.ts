import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { Prisma } from "@prisma/client";

export const educationRouter = router({
  // getEducations: publicProcedure
  //   .input(z.object({ education_id: z.string() }))
  //   .query(async ({ input, ctx }) => {
  //     const educations = await ctx.prisma.profile_education.findUnique({
  //       where: {
  //         education_id: input.education_id,
  //       },
  //     });

  //     return educations;
  //   }),

  getEducations: publicProcedure
    .input(z.object({ profile_id: z.string() }))
    .query(async ({ input, ctx }) => {
      const educations = await ctx.prisma.profile_education.findMany({
        where: {
          profile_id: input.profile_id,
        },
      });

      return educations;
    }),

  // createEducation: protectedProcedure
  //   .input(
  //     z.object({
  //       education_id: z.string(),
  //       profile_id: z.string(),
  //       school: z.string(),
  //       start_year: z.string(),
  //       end_year: z.string(),
  //       description: z.string().nullable(),
  //     })
  //   )
  //   .mutation(async ({ input, ctx }) => {
  //     const newEducation = await ctx.prisma.profile_education.create({
  //       data: {
  //         user_id: ctx.user.id,
  //         ...input,
  //       },
  //     });

  //     return newEducation;
  //   }),

  createEducation: protectedProcedure
    .input(
      z.object({
        profile_id: z.string(),
        school: z.string(),
        start_year: z.string(),
        end_year: z.string(),
        description: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const newEducation = await ctx.prisma.profile_education.create({
        data: {
          profile: {
            connect: { profile_id: input.profile_id },
          },
          user: {
            connect: { id: ctx.user.id },
          },
          school: input.school,
          start_year: input.start_year,
          end_year: input.end_year,
          description: input.description,
        },
      });

      return newEducation;
    }),

  updateEducation: protectedProcedure
    .input(
      z.object({
        education_id: z.string(),
        // profile_id: z.string(),
        school: z.string(),
        start_year: z.string(),
        end_year: z.string(),
        description: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { education_id, school, start_year, end_year, description } = input;

      const education = await ctx.prisma.profile_education.findUnique({
        where: {
          education_id,
        },
      });

      if (!education || education.user_id !== ctx.user.id) {
        // if (!education || education.profile_id !== profile_id) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update this education.",
        });
      }

      const updatedEducation = await ctx.prisma.profile_education.update({
        where: {
          education_id,
        },
        data: {
          school,
          start_year,
          end_year,
          description,
        },
      });

      return updatedEducation;
    }),

  // delete education procedure
  deleteEducation: protectedProcedure
    .input(z.object({ education_id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { education_id } = input;

      const education = await ctx.prisma.profile_education.findUnique({
        where: {
          education_id,
        },
      });

      if (!education || education.user_id !== ctx.user.id) {
        // if (!education || education.profile_id !== profile_id) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete this education.",
        });
      }

      await ctx.prisma.profile_education.delete({
        where: {
          education_id,
        },
      });

      return { success: true };
    }),
});



//nice
// // Define educationRouter with CRUD procedures
// export const educationRouter = router({
//   // Procedure to list education records for a specific user
//   getUserEducations: protectedProcedure
//     .input(z.object({ user_id: z.string() }))
//     .query(async ({ ctx, input }) => {
//       try {
//         // Fetch education records for a specific user
//         const educations = await ctx.prisma.profile_education.findMany({
//           where: {
//             user_id: input.user_id,
//           },
//         });

//         return educations;
//       } catch (error) {
//         // Handle errors by throwing a TRPCError
//         throw new TRPCError({
//           code: "INTERNAL_SERVER_ERROR",
//           message: "Failed to fetch user educations",
//         });
//       }
//     }),

//   // Procedure to create a new education record for a user
//   createEducation: protectedProcedure
//     .input(
//       z.object({
//         user_id: z.string(),
//         school: z.string(),
//         start_year: z.string(),
//         end_year: z.string(),
//         description: z.string().nullable(),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {
//       try {
//         // Create a new education record for a user
//         const newEducation = await ctx.prisma.profile_education.create({
//           data: {
//             user_id: input.user_id,
//             school: input.school,
//             start_year: input.start_year,
//             end_year: input.end_year,
//             description: input.description,
//           },
//         });

//         return newEducation;
//       } catch (error) {
//         // Handle errors by throwing a TRPCError
//         throw new TRPCError({
//           code: "INTERNAL_SERVER_ERROR",
//           message: "Failed to create education",
//         });
//       }
//     }),

//   // Procedure to update an existing education record
//   updateEducation: protectedProcedure
//     .input(
//       z.object({
//         education_id: z.string(),
//         school: z.string(),
//         start_year: z.string(),
//         end_year: z.string(),
//         description: z.string().nullable(),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {
//       try {
//         // Update an existing education record
//         const updatedEducation = await ctx.prisma.profile_education.update({
//           where: {
//             education_id: input.education_id,
//           },
//           data: {
//             school: input.school,
//             start_year: input.start_year,
//             end_year: input.end_year,
//             description: input.description,
//           },
//         });

//         return updatedEducation;
//       } catch (error) {
//         // Handle errors by throwing a TRPCError
//         throw new TRPCError({
//           code: "INTERNAL_SERVER_ERROR",
//           message: "Failed to update education",
//         });
//       }
//     }),

//   // Procedure to delete an education record
//   deleteEducation: protectedProcedure
//     .input(z.object({ education_id: z.string() }))
//     .mutation(async ({ input, ctx }) => {
//       try {
//         // Delete an education record
//         await ctx.prisma.profile_education.delete({
//           where: {
//             education_id: input.education_id,
//           },
//         });

//         return { success: true };
//       } catch (error) {
//         // Handle errors by throwing a TRPCError
//         throw new TRPCError({
//           code: "INTERNAL_SERVER_ERROR",
//           message: "Failed to delete education",
//         });
//       }
//     }),
// });

