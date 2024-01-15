/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { inferAsyncReturnType } from "@trpc/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

  // create profile during registration
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        avatar_url: z.string().nullable(),
        about_me: z.string().nullable(),
        research_interest: z.string().nullable(),
        collab_status: z.string().nullable(),
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

      // if profile for the user id already exists, throw an error
      const profile = await ctx.prisma.profile.findFirst({
        where: {
          user_id: userId,
        },
      });

      if (profile) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Profile already exists.",
        });
      }

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
      const {
        avatar_url,
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


// Procedure to get recommendations based on shared research interests and following accounts of user's following
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

  // Check if the user has specified research interests
  if (!user || !user.research_interest) {
    // Get the users already followed by the new user
    const userFollowingIds = await ctx.prisma.follow.findMany({
      where: {
        follower_id: userId,
      },
      select: {
        following_id: true,
      },
    });

    // Return default recommendations for new users excluding those already followed
    const defaultRecommendationsWithCollab = await ctx.prisma.profile.findMany({
      where: {
        user_id: {
          not: userId,
          notIn: [
            ...userFollowingIds.map((followedUser) => followedUser.following_id),
            // Exclude users already followed by the new user
          ],
        },
        collab_status: "Open For Collaboration", // Include only users with this collab status
      },
      take: 10, // Adjust the number of default recommendations as needed
      select: {
        user_id: true,
        profile_id: true,
        name: true,
        avatar_url: true,
      },
    });

    // Check if there are enough users with "Open For Collaboration" status
    if (defaultRecommendationsWithCollab.length >= 10) {
      return defaultRecommendationsWithCollab;
    }

    // If not enough, fetch additional users without "Open For Collaboration" status
    const remainingDefaultRecommendations = await ctx.prisma.profile.findMany({
      where: {
        user_id: {
          not: userId,
          notIn: [
            ...userFollowingIds.map((followedUser) => followedUser.following_id),
            // Exclude users already followed by the new user
          ],
        },
      },
      take: 10 - defaultRecommendationsWithCollab.length, // Fill the remaining slots
      select: {
        user_id: true,
        profile_id: true,
        name: true,
        avatar_url: true,
      },
    });

    return [...defaultRecommendationsWithCollab, ...remainingDefaultRecommendations];
  }

// Continue with the existing logic for users with specified research interests
const userResearchInterests = user.research_interest
  .toLowerCase()
  .split(",");

// Get the users already followed by the new user
const userFollowingIds = await ctx.prisma.follow.findMany({
  where: {
    follower_id: userId,
  },
  select: {
    following_id: true,
  },
});

// Find other users who share at least 1 similar research interest
const recommendedUsersByInterests = await ctx.prisma.profile.findMany({
  where: {
    user_id: {
      not: userId,
      notIn: [
        ...userFollowingIds.map((followedUser) => followedUser.following_id),
        // Exclude users already followed by the new user
      ],
    },
    research_interest: {
      in: userResearchInterests.map((interest) => interest.trim()),
    },
  },
  take: 10,
  select: {
    user_id: true,
    profile_id: true,
    name: true,
    avatar_url: true,
  },
});

// Find users who are followed by the user's following accounts but not followed by the user
const followingUsersIds = await ctx.prisma.follow.findMany({
  where: {
    follower_id: userId,
  },
  select: {
    following_id: true,
  },
});

const suggestedUsers = await ctx.prisma.follow.findMany({
  where: {
    follower_id: {
      in: followingUsersIds.map((followedUser) => followedUser.following_id),
    },
    following_id: {
      not: userId,
    },
  },
  take: 10,
  select: {
    following_id: true,
  },
});

const suggestedUserIds = suggestedUsers.map(
  (suggestedUser) => suggestedUser.following_id
);

// Exclude users who are already in the list based on shared interests
const uniqueSuggestedUserIds = suggestedUserIds.filter(
  (id) => !recommendedUsersByInterests.some((user) => user.user_id === id)
);

// Find the remaining users based on the suggestion criteria
const remainingUsers = await ctx.prisma.profile.findMany({
  where: {
    user_id: {
      in: uniqueSuggestedUserIds,
    },
  },
  take: 10,
  select: {
    user_id: true,
    profile_id: true,
    name: true,
    avatar_url: true,
  },
});


  // Combine the results from both criteria
  const recommendedUsers = [...recommendedUsersByInterests, ...remainingUsers];

  return recommendedUsers;
}),


 // get profile by user id
 getProfileByUserId: protectedProcedure
 .input(z.object({ user_id: z.string() }))
 .query(async ({ input, ctx }) => {
   const { user_id } = input;

   const profile = await ctx.prisma.profile.findFirst({
     where: {
       user_id,
     },
   });

   if (!profile) {
     throw new TRPCError({
       code: "NOT_FOUND",
       message: "Profile not found",
     });
   }

   return profile;
 }),



});

