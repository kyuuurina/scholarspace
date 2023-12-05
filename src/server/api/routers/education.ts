import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "~/server/api/trpc";

// Define educationRouter with CRUD procedures
export const educationRouter = router({
  // Procedure to list education records for a specific user
  listUserEducations: protectedProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        // Fetch education records for a specific user
        const educations = await ctx.prisma.profile_education.findMany({
          where: {
            user_id: input.user_id,
          },
        });

        return educations;
      } catch (error) {
        // Handle errors by throwing a TRPCError
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch user educations",
        });
      }
    }),

  // Procedure to create a new education record for a user
  createEducation: protectedProcedure
    .input(
      z.object({
        user_id: z.string(),
        school: z.string(),
        start_year: z.string(),
        end_year: z.string(),
        description: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Create a new education record for a user
        const newEducation = await ctx.prisma.profile_education.create({
          data: {
            user_id: input.user_id,
            school: input.school,
            start_year: input.start_year,
            end_year: input.end_year,
            description: input.description,
          },
        });

        return newEducation;
      } catch (error) {
        // Handle errors by throwing a TRPCError
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create education",
        });
      }
    }),

  // Procedure to update an existing education record
  updateEducation: protectedProcedure
    .input(
      z.object({
        education_id: z.string(),
        school: z.string(),
        start_year: z.string(),
        end_year: z.string(),
        description: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Update an existing education record
        const updatedEducation = await ctx.prisma.profile_education.update({
          where: {
            education_id: input.education_id,
          },
          data: {
            school: input.school,
            start_year: input.start_year,
            end_year: input.end_year,
            description: input.description,
          },
        });

        return updatedEducation;
      } catch (error) {
        // Handle errors by throwing a TRPCError
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update education",
        });
      }
    }),

  // Procedure to delete an education record
  deleteEducation: protectedProcedure
    .input(z.object({ education_id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Delete an education record
        await ctx.prisma.profile_education.delete({
          where: {
            education_id: input.education_id,
          },
        });

        return { success: true };
      } catch (error) {
        // Handle errors by throwing a TRPCError
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete education",
        });
      }
    }),
});



//new line

// export const educationRouter = router({
//   // Create education entry for a profile
//   create: protectedProcedure
//   .input(
//     z.object({
//       profile_id: z.string(),
//       school_name: z.string(),
//       start_date: z.date(),
//       end_date: z.date(),
//     })
//   )
//   .mutation(async ({ input, ctx }) => {
//     // Check if the user has permission to create education entries for the profile
//     // You might want to implement additional authorization logic here

//     const profile = await ctx.prisma.profile.findUnique({
//       where: {
//         profile_id: input.profile_id,
//       },
//     });

//     if (!profile) {
//       throw new TRPCError({
//         code: "NOT_FOUND",
//         message: "Profile not found",
//       });
//     }

//     const education = await ctx.prisma.profile_education.create({
//       data: {
//         ...input,
//         profile: {
//           connect: {
//             profile_id: input.profile_id,
//           },
//         },
//       },
//     });

//     return education;
//   }),

//   // Update education entry for a profile
//   update: protectedProcedure
//     .input(
//       z.object({
//         education_id: z.string(),
//         school_name: z.string(),
//         start_date: z.date(),
//         end_date: z.date(),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {
//       // Check if the user has permission to update education entries for the profile
//       // Might want to implement additional authorization logic here

//       const education = await ctx.prisma.profile_education.update({
//         where: {
//           education_id: input.education_id,
//         },
//         data: {
//           school_name: input.school_name,
//           start_date: input.start_date,
//           end_date: input.end_date,
//         },
//       });

//       return education;
//     }),

//   // Delete education entry for a profile
//   delete: protectedProcedure
//     .input(z.object({ education_id: z.string() }))
//     .mutation(async ({ input, ctx }) => {
//       // Check if the user has permission to delete education entries for the profile
//       // Might want to implement additional authorization logic here

//       await ctx.prisma.profile_education.delete({
//         where: {
//           education_id: input.education_id,
//         },
//       });

//       return true;
//     }),

//   // Get education entries for a profile
//   getProfileEducation: protectedProcedure
//     .input(z.object({ profile_id: z.string() }))
//     .query(async ({ input, ctx }) => {
//       // Check if the user has permission to view education entries for the profile
//       // Might want to implement additional authorization logic here

//       const educationEntries = await ctx.prisma.profile_education.findMany({
//         where: {
//           profile_id: input.profile_id,
//         },
//       });

//       return educationEntries;
//     }),
// });
