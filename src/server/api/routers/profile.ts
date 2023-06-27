import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const profileRouter = createTRPCRouter({
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
            id: profileId,
          },
        });

        if (!profile) {
          throw new Error("Profile not found");
        }

        const updatedProfile = await prisma.profile.update({
          where: {
            id: profileId,
          },
          data: {
            name,
            avatar,
            aboutMe,
            skills,
            achievements,
            education,
            researchExperience,
            researchInterest,
            collabStatus,
          },
        });

        return updatedProfile;
      } catch (error: any) {
        throw new Error(`Failed to update profile: ${error.message}`);
      }
    }),
});

export default profileRouter;
