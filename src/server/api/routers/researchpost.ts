// Step 1 - create new server router

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const researchpostRouter = router({
  get: publicProcedure
    .input(z.object({ post_id: z.string() }))
    .query(async ({ input, ctx }) => {
      const post = await ctx.prisma.research_post.findUnique({
        where: {
          post_id: input.post_id,
        },
      });

      return post;
    }),

  // create procedure
  create: protectedProcedure
    .input(
      z.object({
        category: z.string(),
        title: z.string(),
        description: z.string().nullable(),
        author: z.string().nullable(),
        document: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.prisma.research_post.create({
        data: {
          user_id: ctx.user.id,
          ...input,
        },
      });

      return post;
    }),

  // update procedure
  update: protectedProcedure
  .input(
    z.object({
      post_id: z.string(),
      category: z.string(),
      title: z.string(),
      description: z.string().nullable(),
      document: z.string().nullable(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { post_id, category, title, description, document } = input;

    // Check if the authenticated user is the owner of the post
    const post = await ctx.prisma.research_post.findUnique({
      where: {
        post_id,
      },
    });

    if (!post || post.user_id !== ctx.user.id) {
      // User is not authorized to update this post
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to update this post.",
      });
    }

    const updatedResearchPost = await ctx.prisma.research_post.update({
      where: {
        post_id,
      },
      data: {
        category,
        title,
        description,
        document,
      },
    });
    console.log(updatedResearchPost);

    return updatedResearchPost;
  }),

delete: protectedProcedure
  .input(z.object({ post_id: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const { post_id } = input;

    // Check if the authenticated user is the owner of the post
    const post = await ctx.prisma.research_post.findUnique({
      where: {
        post_id,
      },
    });

    if (!post || post.user_id !== ctx.user.id) {
      // User is not authorized to delete this post
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to delete this post.",
      });
    }

    await ctx.prisma.research_post.delete({
      where: {
        post_id,
      },
    });

    return { success: true };
  }),
});



// export const researchpostRouter = router({
//   create: protectedProcedure
//     .input(
//       z.object({
//         category: z.string(),
//         title: z.string(),
//         description: z.string().nullable(),
//         author: z.string(),
//         document: z.string().nullable(),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {
//       const post = await ctx.prisma.research_post.create({
//         data: {
//           user_id: ctx.user.id,
//           ...input,
//         },
//       });

//       return post;
//     }),

//   update: protectedProcedure
//     .input(
//       z.object({
//         post_id: z.string(),
//         category: z.string(),
//         title: z.string(),
//         description: z.string().nullable(),
//         author: z.string().nullable(),
//         document: z.string().nullable(),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {
//       const post = await ctx.prisma.research_post.update({
//         where: {
//           post_id: input.post_id,
//         },
//         data: {
//           ...input,
//         },
//       });

//       return post;
//     }),

//   delete: protectedProcedure
//     .input(z.object({ post_id: z.string() }))
//     .mutation(async ({ input, ctx }) => {
//       await ctx.prisma.research_post.delete({
//         where: {
//           post_id: input.post_id,
//         },
//       });

//       return true;
//     }),
// });




// import { z } from "zod";
// import {TRPCError} from "@trpc/server";
// import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";

// //import * as trpc from "@trpc/server";
// import { PrismaClient, research_post } from "@prisma/client";

// const prisma = new PrismaClient();

// export const postRouter = router({
//   create: protectedProcedure
//     .input(
//       z.object({
//         category: z.string(),
//         title: z.string(),
//         description: z.string().nullable(),
//         author: z.string(),
//         document: z.string().nullable(), // Store the file path as a string
//       })
//     )
//     .mutation(async ({ input }) => {
//       const { document, ...data } = input;

//       const post = await prisma.research_post.create({
//         data: {
//           ...input,
//           document: "",
//           post_id: String(Date.now()),
//           user_id: "dummy-user-id", // Replace with the actual user ID
//           title: "", // Set appropriate default values
//           description: "", // Set appropriate default values
//         },
//       });

//       return post;
//     }),
//   update: protectedProcedure
//     .input(
//       z.object({
//         post_id: z.string(),
//         category: z.string(),
//         title: z.string(),
//         description: z.string().optional(),
//         author: z.string().optional(),
//         document: z.string().optional(),
//       })
//     )
//     .mutation(async ({ input }) => {
//       const { post_id, ...data } = input;

//       const updatedPost = await prisma.research_post.update({
//         where: {
//           post_id,
//         },
//         data,
//       });

//       return updatedPost;
//     }),

//   delete: protectedProcedure
//     .input(z.object({ id: z.string() }))
//     .mutation(async ({ input }) => {
//       const { id } = input;

//       await prisma.research_post.delete({
//         where: {
//           post_id: id,
//         },
//       });

//       return { success: true };
//     }),
// });