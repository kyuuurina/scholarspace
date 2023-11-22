/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

// to do: avatar and collab_status enum

import { z } from "zod";
import { router, protectedProcedure } from "~/server/api/trpc";
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

  updateProfile: protectedProcedure
    .input(
      z.object({
        profile_id: z.string(),
        name: z.string(),
        // avatar: z.string(),
        about_me: z.string().nullable(),
        skills: z.array(z.string()).nullable(),
        achievements: z.array(z.string()),
        education: z.array(z.string()),
        research_experience: z.array(z.string()).nullable(),
        research_interest: z.array(z.string()).nullable(),
        collab_status: z.enum(['Open_For_Collaboration', 'Not_Open_For_Collaboration']),
      })
    )
    .mutation(async ({ input }) => {
      const {
        profile_id,
        name,
        // avatar,
        about_me,
        skills,
        achievements,
        education,
        research_experience,
        research_interest,
        collab_status,
      } = input;

      try {
        const profile = await prisma.profile.findUnique({
          where: {
            profile_id: profile_id,
          },
        });

        if (!profile) {
          throw new Error("Profile not found");
        }

        const updatedProfile = await prisma.profile.update({
          where: {
            profile_id: profile_id,
          },
          data: {
            name,
            // avatar,
            about_me,
            skills: skills ? { set: skills }: undefined, // Use Prisma set operation for arrays & accept nullable
            achievements: achievements ? { set: achievements }: undefined ,
            education: { set: education },
            research_experience: research_experience ? { set: research_experience } : undefined,
            research_interest: research_interest ? { set: research_interest } : undefined,
            //collab_status: collab_status ? { set: [collab_status] } : undefined as collab_status[],
            //collab_status: collab_status ? { set: [collab_status] as any } : undefined,
          },
        });

        return updatedProfile;
      } catch (error: any) {
        throw new Error(`Failed to update profile: ${error.message}`);
      }
    }),
});

export default profileRouter;
