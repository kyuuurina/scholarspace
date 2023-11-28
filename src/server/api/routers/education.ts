// src/server/api/router/education.ts

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "~/server/api/trpc";

export const educationRouter = router({
  // Create education entry for a profile
  create: protectedProcedure
  .input(
    z.object({
      profile_id: z.string(),
      school_name: z.string(),
      start_date: z.date(),
      end_date: z.date(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    // Check if the user has permission to create education entries for the profile
    // You might want to implement additional authorization logic here

    const profile = await ctx.prisma.profile.findUnique({
      where: {
        profile_id: input.profile_id,
      },
    });

    if (!profile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Profile not found",
      });
    }

    const education = await ctx.prisma.profile_education.create({
      data: {
        ...input,
        profile: {
          connect: {
            profile_id: input.profile_id,
          },
        },
      },
    });

    return education;
  }),

  // Update education entry for a profile
  update: protectedProcedure
    .input(
      z.object({
        education_id: z.string(),
        school_name: z.string(),
        start_date: z.date(),
        end_date: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check if the user has permission to update education entries for the profile
      // Might want to implement additional authorization logic here

      const education = await ctx.prisma.profile_education.update({
        where: {
          education_id: input.education_id,
        },
        data: {
          school_name: input.school_name,
          start_date: input.start_date,
          end_date: input.end_date,
        },
      });

      return education;
    }),

  // Delete education entry for a profile
  delete: protectedProcedure
    .input(z.object({ education_id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Check if the user has permission to delete education entries for the profile
      // Might want to implement additional authorization logic here

      await ctx.prisma.profile_education.delete({
        where: {
          education_id: input.education_id,
        },
      });

      return true;
    }),

  // Get education entries for a profile
  getProfileEducation: protectedProcedure
    .input(z.object({ profile_id: z.string() }))
    .query(async ({ input, ctx }) => {
      // Check if the user has permission to view education entries for the profile
      // Might want to implement additional authorization logic here

      const educationEntries = await ctx.prisma.profile_education.findMany({
        where: {
          profile_id: input.profile_id,
        },
      });

      return educationEntries;
    }),
});
