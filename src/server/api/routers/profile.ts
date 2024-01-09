import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { inferAsyncReturnType } from "@trpc/server";


// Define the profile router
export const profileRouter = router({

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

  // Procedure to update a user's profile
  updateProfile: protectedProcedure
    .input(
      // Define the input schema for the updateProfile mutation
      z.object({
        profile_id: z.string(),
        avatar_url: z.string().nullable(),
        name: z.string(),
        about_me: z.string().nullable(),
        skills: z.string().nullable(),
        research_interest: z.string().nullable(),
        collab_status: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Destructure input to get relevant properties
      const { avatar_url, profile_id, name, about_me, skills, research_interest, collab_status } = input;

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

      // Update the profile in the database with the provided data
      const updatedProfile = await ctx.prisma.profile.update({
        where: {
          profile_id,
        },
        data: {
          avatar_url,
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
    }),


    //procedure to get recommendations based on shared research interests
    getRecommendations: protectedProcedure.query(async ({ ctx }) => {
      const userId = ctx.user?.id;
    
      // Get the user's research interests
      const user = await ctx.prisma.profile.findFirst({
        where: {
          user_id: userId,
        },
        select: {
          research_interest: true,
        },
      });
    
      if (!user || !user.research_interest) {
        return [];
      }
    
      const userResearchInterests = user.research_interest.toLowerCase().split(",");
    
      // Find other users who share at least 1 similar research interest and are not followed by the current user
      const followedUsersIds = await ctx.prisma.follow.findMany({
        where: {
          follower_id: userId,
        },
        select: {
          following_id: true,
        },
      });
    
      const recommendedUsers = await ctx.prisma.profile.findMany({
        where: {
          user_id: {
            not: userId, // Exclude the current user
          },
          AND: [
            {
              OR: userResearchInterests.map((interest) => ({
                research_interest: {
                  contains: interest.trim(),
                },
              })),
            },
            {
              NOT: {
                user_id: {
                  in: followedUsersIds.map((followedUser) => followedUser.following_id),
                },
              },
            },
          ],
        },
        take: 10, // Limit the number of recommendations
        select: {
          user_id: true,
          profile_id: true,
          name: true,
          avatar_url: true,
        },
      });
    
      return recommendedUsers;
    }),

});

    // //Procedure to get recommendations based on shared research interests
    // getRecommendations: protectedProcedure
    // .query(async ({ ctx }) => {
    //   const userId = ctx.user?.id;
  
    //   // Get the user's research interests
    //   const user = await ctx.prisma.profile.findFirst({
    //     where: {
    //       user_id: userId,
    //     },
    //     select: {
    //       research_interest: true,
    //     },
    //   });
  
    //   if (!user || !user.research_interest) {
    //     return [];
    //   }
  
    //   const userResearchInterests = user.research_interest.split(",");
  
    //   // Find other users who share the same research interests
    //   const recommendedUsers = await ctx.prisma.profile.findMany({
    //     where: {
    //       user_id: {
    //         not: userId, // Exclude the current user
    //       },
    //       research_interest: {
    //         in: userResearchInterests,
    //       },
    //     },
    //     take: 5, // Limit the number of recommendations
    //     select: {
    //       user_id: true,
    //       profile_id: true,
    //       name: true,
    //       avatar_url: true,
    //     },
    //   });
  
    //   return recommendedUsers;
    // }),