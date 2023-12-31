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

      return {addedLike: false, likeCount};
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





  // toggleLike: protectedProcedure
  //   .input(z.object({like_id: z.string()}))
  //   .query (async ({input: {like_id}, ctx}) => {
  //     const data = { post_id: post_id, user_id: ctx.user.id };

  //     const existingLike = await ctx.prisma.post_likes.findUnique({
  //       where: { user_id_post_id: data },
  //     })

  //     //check whether have liked the post or not
  //     if (existingLike == null) {
  //       await ctx.prisma.post_likes.create({data})
  //       return { addedLike: true}
  //     }
  //     else  //if already liked
  //     {
  //       await ctx.prisma.post_likes.delete({where: {like_id}})
  //       return { addedLike: false}
  //     }),

  // likePost: protectedProcedure
  //   .input(z.object({ post_id: z.string() }))
  //   .mutation(async ({ input, ctx }) => {
  //     const existingLike = await ctx.prisma.post_likes.findUnique({
  //       where: {
  //         post_id_user_id: {
  //           post_id: input.post_id,
  //           user_id: ctx.user.id,
  //         },
  //       } as {
  //         post_id_user_id: {
  //           post_id: string;
  //           user_id: string;
  //         };
  //       },
  //     });

  //     if (existingLike) {
  //       // User has already liked the post, you may throw an error or handle it as needed
  //       throw new TRPCError({
  //         message: "You have already liked this post.",
  //         code: "CONFLICT",
  //       });
  //     }

  //     const newLike = await ctx.prisma.post_likes.create({
  //       data: {
  //         post_id: input.post_id,
  //         user_id: ctx.user.id,
  //       },
  //     });

  //     return newLike;

  //     console.log("likeRouter likePost", newLike);
  //   }),

  // unlikePost: protectedProcedure
  //   .input(z.object({ post_id: z.string() }))
  //   .mutation(async ({ input, ctx }) => {
  //     const existingLike = await ctx.prisma.post_likes.findUnique({
  //       where: {
  //         post_id_user_id: {
  //           post_id: input.post_id,
  //           user_id: ctx.user.id,
  //         },
  //       },
  //     });

  //     if (!existingLike) {
  //       // User has not liked the post, you may throw an error or handle it as needed
  //       throw new TRPCError({
  //         message: "You have not liked this post.",
  //         code: "CONFLICT",
  //       });
  //     }

  //     await ctx.prisma.post_likes.delete({
  //       where: {
  //         like_id: existingLike.like_id,
  //       },
  //     });

  //     // Return some indication of success, if needed
  //     return { success: true };

  //     console.log("likeRouter unlikePost", existingLike);
  //   }),



  // like: protectedProcedure
  //   .input(z.object({ post_id: z.string() }))
  //   .mutation(async ({ input, ctx }) => {
  //     const { post_id } = input;

  //     const existingLike = await ctx.prisma.post_likes.findUnique({
  //       where: {
  //         post_id_user_id: {
  //           post_id,
  //           user_id: ctx.user.id,
  //         },
  //       },
  //     });

  //     if (existingLike) {
  //       throw new TRPCError({
  //         code: "CONFLICT",
  //         message: "You have already liked this post.",
  //       });
  //     }

  //     const like = await ctx.prisma.post_likes.create({
  //       data: {
  //         post_id,
  //         user_id: ctx.user.id,
  //       },
  //     });

  //     return like;
  //   }),

  //   unlike: protectedProcedure
  //   .input(z.object({ post_id: z.string() }))
  //   .mutation(async ({ input, ctx }) => {
  //     const { post_id } = input;
  
  //     // Delete the like entry made by the user for the specified post
  //     await ctx.prisma.post_likes.delete({
  //       where: {
  //         post_id_user_id: {
  //           post_id,
  //           user_id: ctx.user.id,
  //         },
  //       },
  //     });
  
  //     return { success: true };
  //   }),
});



//draft - like unlike example
// import { z } from "zod";
// import { TRPCError } from "@trpc/server";
// import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export const researchpostRouter = router({
//   get: publicProcedure
//     .input(z.object({ post_id: z.string() }))
//     .query(async ({ input, ctx }) => {
//       const post = await ctx.prisma.research_post.findUnique({
//         where: {
//           post_id: input.post_id,
//         },
//       });

//       return post;
//     }),

//   create: protectedProcedure
//     .input(
//       z.object({
//         category: z.string(),
//         title: z.string(),
//         description: z.string().nullable(),
//         author: z.string().nullable(),
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
//         document: z.string().nullable(),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {
//       const { post_id, category, title, description, document } = input;

//       // Check if the authenticated user is the owner of the post
//       const post = await ctx.prisma.research_post.findUnique({
//         where: {
//           post_id,
//         },
//       });

//       if (!post || post.user_id !== ctx.user.id) {
//         // User is not authorized to update this post
//         throw new TRPCError({
//           code: "UNAUTHORIZED",
//           message: "You are not authorized to update this post.",
//         });
//       }

//       const updatedResearchPost = await ctx.prisma.research_post.update({
//         where: {
//           post_id,
//         },
//         data: {
//           category,
//           title,
//           description,
//           document,
//         },
//       });
//       console.log(updatedResearchPost);
//       return updatedResearchPost;
//     }),

//   delete: protectedProcedure
//     .input(z.object({ post_id: z.string() }))
//     .mutation(async ({ input, ctx }) => {
//       const { post_id } = input;

//       // Check if the authenticated user is the owner of the post
//       const post = await ctx.prisma.research_post.findUnique({
//         where: {
//           post_id,
//         },
//       });

//       if (!post || post.user_id !== ctx.user.id) {
//         // User is not authorized to delete this post
//         throw new TRPCError({
//           code: "UNAUTHORIZED",
//           message: "You are not authorized to delete this post.",
//         });
//       }

//       await ctx.prisma.research_post.delete({
//         where: {
//           post_id,
//         },
//       });

//       return { success: true };
//     }),

//   like: protectedProcedure
//     .input(
//       z.object({
//         post_id: z.string(),
//       })
//     )
//     .mutation(async ({ ctx, input }) => {
//       const userId = ctx.user.id;
//       const { prisma } = ctx;

//       // Check if the user has already liked the post
//       const existingLike = await prisma.post_likes.findUnique({
//         where: {
//           post_id_user_id: {
//             post_id: input.post_id,
//             user_id: userId,
//           },
//         },
//       });

//       if (existingLike) {
//         // User has already liked the post
//         throw new TRPCError({
//           code: "CONFLICT",
//           message: "You have already liked this research post.",
//         });
//       }

//       // Create a new like entry
//       const newLike = await prisma.post_likes.create({
//         data: {
//           post_id: input.post_id,
//           user: {
//             connect: {
//               id: userId,
//             },
//           },
//         },
//       } as prisma.post_likesCreateInput); // Type assertion


//       return newLike;

//     }),

// unlike: protectedProcedure
//   .input(
//     z.object({
//       post_id: z.string(),
//     })
//   )
//   .mutation(async ({ ctx, input }) => {
//     const userId = ctx.user.id;
//     const { prisma } = ctx;

//     // Check if the user has liked the post
//     const existingLike = await prisma.post_likes.findUnique({
//       where: {
//         post_id_user_id: {
//           post_id: input.post_id,
//           user_id: userId,
//         },
//       },
//     });

//     if (!existingLike) {
//       // User has not liked the post
//       throw new TRPCError({
//         code: "CONFLICT",
//         message: "You have not liked this research post.",
//       });
//     }

//     // Delete the existing like entry
//     await prisma.post_likes.delete({
//       where: {
//         post_id_user_id: {
//           post_id: input.post_id,
//           user_id: userId,
//         },
//       },
//     });
//   }),

// });


//draft
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