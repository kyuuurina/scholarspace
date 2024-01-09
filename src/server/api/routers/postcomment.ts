// postcomment.ts

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "~/server/api/trpc";

// Define a TRPC router for post comments
export const postCommentRouter = router({
  // Query to list post comments associated with a research post
  list: protectedProcedure
    .input(
      z.object({
        post_id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { post_id } = input;

      // Fetch post comments based on the provided post_id and include user profile
      const postComments = await ctx.prisma.post_comments.findMany({
        where: {
          post_id,
        },
        include: {
          user: {
            select: {
              profile: true,
            },
          },
        },
      });

      // Throw an error if no post comments are found
      if (!postComments) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post comments not found",
        });
      }

      return postComments;
    }),

// Mutation to create a new post comment
create: protectedProcedure
  .input(
    z.object({
      value: z.string(),
      post_id: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { value, post_id } = input;

    // Check if the associated post exists
    const existingPost = await ctx.prisma.research_post.findUnique({
      where: {
        post_id,
      },
    });

    // Throw an error if the post does not exist
    if (!existingPost) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Associated post not found",
      });
    }

    // Create a new comment for the associated post and select additional fields
    const newComment = await ctx.prisma.post_comments.create({
      data: {
        value,
        user_id: ctx.user.id,
        post_id,
      },
      select: {
        comment_id: true,
        value: true,
        created_at: true,
        user: {
          select: {
            profile: {
              select: {
                name: true,
                avatar_url: true,
              },
            },
          },
        },
      },
    });

    return newComment;
  }),

  //get comments of post
  getComments: protectedProcedure
    .input(
      z.object({
        post_id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { post_id } = input;

      // Fetch post comments based on the provided post_id
      const postComments = await ctx.prisma.post_comments.findMany({
        where: {
          post_id,
        },
        select: {
          comment_id: true,
          value: true,
          created_at: true,
          user: {
            select: {
              profile: {
                select: {
                  name: true,
                  avatar_url: true,
                },
              },
            },
          },
        },
        // orderBy: {
        //   created_at: "asc", // Order comments by creation date (you can adjust this based on your needs)
        // },
      });

      return postComments;
    }),

  // Mutation to update an existing post comment
  update: protectedProcedure
    .input(
      z.object({
        comment_id: z.string(),
        value: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { comment_id, value } = input;

      // Check if the comment with the given ID exists
      const existingComment = await ctx.prisma.post_comments.findUnique({
        where: {
          comment_id,
        },
      });

      // Throw an error if the comment does not exist
      if (!existingComment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }

      // Update the value of the existing comment
      const updatedComment = await ctx.prisma.post_comments.update({
        where: {
          comment_id,
        },
        data: {
          value,
        },
      });

      return updatedComment;
    }),

// Mutation to delete an existing post comment
delete: protectedProcedure
  .input(
    z.object({
      comment_id: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { comment_id } = input;

    // Check if the comment with the given ID exists
    const existingComment = await ctx.prisma.post_comments.findUnique({
      where: {
        comment_id,
      },
    });

    // Throw an error if the comment does not exist
    if (!existingComment) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Comment not found",
      });
    }

    // Check if the user is the owner of the comment
    if (existingComment.user_id !== ctx.user.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User is not authorized to delete this comment",
      });
    }

    // Delete the comment with the given ID
    await ctx.prisma.post_comments.delete({
      where: {
        comment_id,
      },
    });

    return true;
  }),
});
