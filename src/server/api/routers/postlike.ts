// Step 1 - create new server router

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { Prisma } from "@prisma/client";

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
  .input(z.object({ post_id: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const { user } = ctx;

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

      // Fetch updated like count after deletion
      const likeCount = await ctx.prisma.post_likes.count({
        where: {
          post_id: input.post_id,
        },
      });

      // Check if the user has liked the post after deletion
      const hasLiked = await ctx.prisma.post_likes.findFirst({
        where: {
          post_id: input.post_id,
          user_id: user.id,
        },
      });

      return { addedLike: !existingLike, likeCount, hasLiked: !!hasLiked };
    } else {
      await ctx.prisma.post_likes.create({
        data: {
          post_id: input.post_id,
          user_id: user.id,
          liked_at: new Date(),
        },
      });

      // Fetch updated like count after creation
      const likeCount = await ctx.prisma.post_likes.count({
        where: {
          post_id: input.post_id,
        },
      });

      return { addedLike: true, likeCount, hasLiked: true };
    }
  }),

  getPostLikeCount: protectedProcedure
  .input(z.object({ post_id: z.string() }))
  .query(async ({ input, ctx }) => {
    const likeCount = await ctx.prisma.post_likes.count({
      where: {
        post_id: input.post_id,
      },
    });
    return likeCount;
  }),

  //new like
  createPostLike: protectedProcedure
  .input(z.object({
    id: z.string(),
  }))
  .mutation(({ ctx, input }) => ctx.prisma.post_likes.create({
    data: {
      research_post: {
        connect: {
          post_id: input.id,
        },
      },
      user: {
        connect: {
          id: ctx.user.id,
        },
      },
      liked_at: new Date(), // Provide the current timestamp
    },
  })),

  //new unlike
  deletePostLike: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(({ ctx, input }) => ctx.prisma.post_likes.deleteMany({
      where: {
        research_post: {
          post_id: input.id,
        },
        user: {
          id: ctx.user.id,
        },
      },
    })),


    //getLikesCount
    getLikesCount: publicProcedure
    .input(z.object({
      postId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const likesCount = await ctx.prisma.post_likes.count({
        where: {
          post_id: input.postId,
        },
      });

      return likesCount;
    }),


});