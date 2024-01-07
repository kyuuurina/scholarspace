// Step 1 - create new server router

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const likeRouter = router({
  get: publicProcedure
    .input(z.object({ like_id: z.string() }))
    .query(async ({ input, ctx }) => {
      const post = await ctx.prisma.post_likes.findUnique({
        where: {
          like_id: input.like_id,
        },
      });

      return post;

      console.log("likeRouter get", post);
    }),

  getMyLikedPosts: protectedProcedure
  .input(z.object({post_id: z.string()}))
  .query(async ({input, ctx}) => {
    const myLikedPosts = await ctx.prisma.post_likes.findMany({
      where: {
        user_id: ctx.user.id,
      },
    });

    return myLikedPosts;

    console.log("likeRouter getMyLikedPosts", myLikedPosts);
  }),

  //like and unlike post
  toggleLike: protectedProcedure
  .input(z.object({post_id: z.string()}))
  .mutation(async ({input, ctx}) => {
    const {user} = ctx;

    const existingLike = await ctx.prisma.post_likes.findUnique({
      where: {
        post_id_user_id: {
          post_id: input.post_id,
          user_id: user.id,
        },
      },
    });

    if (existingLike) {
      await ctx.prisma.post_likes.delete({
        where: {
          like_id: existingLike.like_id,
        },
      });

      //Fetch updated like count after deletion
      const likeCount = await ctx.prisma.post_likes.count({
        where: {
          post_id: input.post_id,
        },
      });

      // return {addedLike: false, likeCount};
      return {addedLike: !existingLike, likeCount};
    } else {
      await ctx.prisma.post_likes.create({
        data: {
          post_id: input.post_id,
          user_id: user.id,
          liked_at: new Date(),
        },
      });

      //Fetch updated like count after creation
      const likeCount = await ctx.prisma.post_likes.count({
        where: {
          post_id: input.post_id,
        },
      });
      return {addedLike: true, likeCount};
    }
  }),
});