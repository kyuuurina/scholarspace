/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { z } from "zod";
import { router, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const profileRouter = router({
  validate: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user?.id;

    // check if this user has a profile
    const profile = await ctx.prisma.profile.findFirst({
      where: {
        user_id: userId,
      },
    });

    if (!profile) {
      return false;
    }

    return true;
  }),

  // Procedure to get a user's profile
  get: protectedProcedure
    .input(z.object({ profile_id: z.string() }))
    .query(async ({ input, ctx }) => {
      // Find the profile in the database based on the provided profile_id
      const profile = await ctx.prisma.profile.findUnique({
        where: {
          profile_id: input.profile_id,
        },
      });

      // If the profile is not found, throw a NOT_FOUND error
      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Profile not found",
        });
      }

      // Return the profile if found
      return {
        ...profile,
      };
    }),

  // create profile during registration
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        avatar_url: z.string().nullable(),
        about_me: z.string().nullable(),
        research_interest: z.string().nullable(),
        collab_status: z.enum([
          "Open_For_Collaboration",
          "Not_Open_For_Collaboration",
        ]),
        skills: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        name,
        avatar_url,
        about_me,
        research_interest,
        collab_status,
        skills,
      } = input;

      const userId = ctx.user?.id;
      console.log("User ID:", userId);

      try {
        const profile = await prisma.profile.create({
          data: {
            user_id: userId,
            name,
            avatar_url,
            about_me,
            research_interest,
            collab_status,
            skills,
          },
        });

        return profile;
      } catch (error: any) {
        throw new Error(`Failed to create profile: ${error.message}`);
      }
    }),

    updateProfile: protectedProcedure
    .input(
      z.object({
        profile_id: z.string(),
        name: z.string(),
        about_me: z.string().nullable(),
        skills: z.string().nullable(),
        research_interest: z.string().nullable(),
        collab_status: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Destructure input to get relevant properties
      const {
        profile_id,
        name,
        about_me,
        skills,
        research_interest,
        collab_status,
      } = input;
  
      // Find the profile in the database based on the provided profile_id
      const profile = await ctx.prisma.profile.findUnique({
        where: {
          profile_id,
        },
      });
  
      // If the profile doesn't exist or the user is not the owner, throw an error
      if (!profile || profile.user_id !== ctx.user.id) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update this profile.",
        });
      }
  
      try {
        // Update the profile in the database with the provided data
        const updatedProfile = await ctx.prisma.profile.update({
          where: {
            profile_id,
          },
          data: {
            name,
            about_me,
            skills,
            research_interest,
            collab_status,
          },
        });
  
        console.log("profileRouter updatedProfile:", updatedProfile);
        // Return the updated profile
        return updatedProfile;
      } catch (error: any) {
        throw new Error(`Failed to update profile: ${error.message}`);
      }
    }),
});

export default profileRouter;
