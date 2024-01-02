import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "~/server/api/trpc";

export const followRouter = router({
  toggleFollow: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input: { userId }, ctx }) => {
      // const currentUserId = ctx.session?.user.id;
      const { user } = ctx;

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const existingFollow = await ctx.prisma.follow.findUnique({
        where: {
          follower_id_following_id: {
            // follower_id: currentUserId,
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
    }),

  // getfollowerslist
  getFollowersList: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input: { userId }, ctx }) => {
      const followers = await ctx.prisma.follow.findMany({
        where: { following_id: userId },
        include: { user_follow_follower_idTouser: true },
      });

      const followersList = followers.map((follow) => follow.user_follow_follower_idTouser);
      return followersList;
    }),

  // getfollowinglist
  getFollowingList: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input: { userId }, ctx }) => {
      const following = await ctx.prisma.follow.findMany({
        where: { follower_id: userId },
        include: { user_follow_following_idTouser: true },
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