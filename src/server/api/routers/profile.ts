/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
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
        profileId: z.string(),
        name: z.string(),
        avatar: z.string(),
        aboutMe: z.string(),
        skills: z.array(z.string()),
        achievements: z.array(z.string()),
        education: z.array(z.string()),
        researchExperience: z.array(z.string()),
        researchInterest: z.array(z.string()),
        collabStatus: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const {
        profileId,
        name,
        avatar,
        aboutMe,
        skills,
        achievements,
        education,
        researchExperience,
        researchInterest,
        collabStatus,
      } = input;

      try {
        const profile = await prisma.profile.findUnique({
          where: {
            profile_id: profileId,
          },
        });

        if (!profile) {
          throw new Error("Profile not found");
        }

        const updatedProfile = await prisma.profile.update({
          where: {
            profile_id: profileId,
          },
          data: {
            name,
            avatar,
            about_me: aboutMe,
            skills,
            achievements,
            education,
            research_experience: researchExperience,
            research_interest: researchInterest,
            collab_status: collabStatus,
          },
        });

        return updatedProfile;
      } catch (error: any) {
        throw new Error(`Failed to update profile: ${error.message}`);
      }
    }),
});

export default profileRouter;
