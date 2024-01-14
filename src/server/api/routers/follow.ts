import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "~/server/api/trpc";

export const followRouter = router({
  toggleFollow: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input: { userId }, ctx }) => {
      const { user } = ctx;

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      try {
        const existingFollow = await ctx.prisma.follow.findUnique({
          where: {
            follower_id_following_id: {
              follower_id: user.id,
              following_id: userId,
            },
          },
        });

        if (!existingFollow) {
          await ctx.prisma.follow.create({
            data: {
              follower_id: user.id,
              following_id: userId,
            },
          });
          return { isFollowing: true };
        } else {
          await ctx.prisma.follow.delete({
            where: {
              follower_id_following_id: {
                follower_id: user.id,
                following_id: userId,
              },
            },
          });
          return { isFollowing: false };
        }
      } catch (error) {
        console.error('Error toggling follow:', error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error toggling follow",
        });
      }
    }),

    //get follow status
    getFollowStatus: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input: { userId }, ctx }) => {
      const { user } = ctx;

      if (!user) {
        return { isFollowing: false }; // Return false if the user is not authenticated
      }

      const existingFollow = await ctx.prisma.follow.findUnique({
        where: {
          follower_id_following_id: {
            follower_id: user.id,
            following_id: userId,
          },
        },
      });

      return { isFollowing: !!existingFollow }; // Convert to boolean
    }),

// get followers list
getFollowersList: protectedProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input: { userId }, ctx }) => {
    const followers = await ctx.prisma.follow.findMany({
      where: { following_id: userId },
      include: {
        user_follow_follower_idTouser: {
          include: { profile: true } // Include the profile relation
        }
      },
    });

    const followersList = followers.map((follow) => follow.user_follow_follower_idTouser.profile);
    return followersList;
  }),

    // get following list
    getFollowingList: protectedProcedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input: { userId }, ctx }) => {
        const following = await ctx.prisma.follow.findMany({
          where: { follower_id: userId },
          include: {
            user_follow_following_idTouser: {
              include: { profile: true } // Include the profile relation
            }
          },
        });

        const followingList = following.map((follow) => follow.user_follow_following_idTouser);
        return followingList;
      }),

  // procedure to remove follower
  removeFollower: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input: { userId }, ctx }) => {
      const { user } = ctx;

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      await ctx.prisma.follow.delete({
        where: {
          follower_id_following_id: {
            follower_id: user.id,
            following_id: userId,
          },
        },
      });

      return { success: true };
    }),

});
