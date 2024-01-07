/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// Step 1 - create new server router
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { Prisma, PrismaClient } from "@prisma/client";


// Helper function to fetch infinite research posts
async function getInfiniteResearchPosts({
  whereClause,
  ctx,
  limit,
  cursor,
}: {
  whereClause?: Prisma.research_postWhereInput;
  limit: number;
  cursor: string | undefined;
  ctx: {
    prisma: PrismaClient; // Replace with the actual PrismaClient type
    // Add other properties as needed
  };
}) {
  const data = await ctx.prisma.research_post.findMany({
    take: limit + 1,
    cursor: cursor ? { post_id: cursor } : undefined,
    orderBy: [{ created_at: "desc" }, { post_id: "desc" }],
    where: whereClause,
    select: {
      post_id: true,
      category: true,
      title: true,
      description: true,
      author: true,
      created_at: true,
      user: {
        select: { id: true, name: true, avatar_url: true },
      },
    },
  });

  let nextCursor: string | undefined;
  if (data.length > limit) {
    const nextItem = data.pop();
    if (nextItem != null) {
      nextCursor = nextItem.post_id;
    }
  }

  return {
    researchPosts: data.map((post: any) => {
      return {
        post_id: post.post_id,
        user_id: post.user_id,
        category: post.category,
        title: post.title,
        document: post.document,
        description: post.description,
        author: post.author,
        created_at: post.created_at,

      };
    }),
    nextCursor,
  };
}


// Step 1 - create new server router
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

  getMyPosts: protectedProcedure
    .input(z.object({ post_id: z.string() }))
    .query(async ({ input, ctx }) => {
      const myPosts = await ctx.prisma.research_post.findMany({
        where: {
          profile_id:input.post_id,  //pass profile_id to router
        },
        orderBy: {
          created_at: 'desc', // Order by created_at in descending order
        },
      });

      return myPosts;
    }),

  getFollowingPosts: publicProcedure
    .input(z.object({ limit: z.number().optional(), cursor: z.string().optional() }))
    .query(async ({ input: { limit = 10, cursor }, ctx }) => {
    // const currentUserId = ctx.session?.user.id;
      const {user} = ctx;

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not authenticated.",
        });
      }

      const followingUsers = await ctx.prisma.follow.findMany({
        where: {
          follower_id: user.id,
        },
        select: {
          following_id: true,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const followingUserIds = followingUsers.map((user) => user.following_id)  as string[];

      return await getInfiniteResearchPosts({
        limit,
        cursor,
        ctx,
        whereClause: { user_id: { in: followingUserIds } },
      });
    }),


  // Helper function to fetch infinite research posts
  create: protectedProcedure
    .input(
      z.object({
        profile_id: z.string(),
        category: z.string(),
        title: z.string(),
        description: z.string().nullable(),
        author: z.string().nullable(),
        document: z.string().nullable(),
        // created_at: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.prisma.research_post.create({
        data: {
          user_id: ctx.user.id,
          ...input,
          created_at: new Date(),
        },
      });

    //   .mutation(async ({ input, ctx }) => {
    //     const post = await ctx.prisma.research_post.create({
    //       data: {
    //         profile: {
    //           connect: { profile_id: input.profile_id },
    //         },
    //         user: {
    //           connect: { id: ctx.user.id },
    //         },
    //         ...input,
    //         created_at: new Date(),
    //       },
    //     });

      return post;
    }),

  update: protectedProcedure
    .input(
      z.object({
        post_id: z.string(),
        category: z.string(),
        title: z.string(),
        description: z.string().nullable(),
        author: z.string().nullable(),
        document: z.string().nullable(),
        // created_at: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { post_id, category, title, description, author, document } = input;
      console.log("Help Me",post_id)
      const post = await ctx.prisma.research_post.findUnique({
        where: {
          post_id,
        },
      });
      console.log('Amdwae',post)
      if (!post || post.user_id !== ctx.user.id) {
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
          author,
          document,
        },
      });

      console.log("researchPostRouter:", updatedResearchPost);
      return updatedResearchPost;
    }),

  delete: protectedProcedure
    .input(z.object({ post_id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { post_id } = input;

      const post = await ctx.prisma.research_post.findUnique({
        where: {
          post_id,
        },
      });

      if (!post || post.user_id !== ctx.user.id) {
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

    search: publicProcedure
    .input(
        z.object({
            query: z.string(),
        })
    )
    .query(async ({ input, ctx }) => {
      const researchPosts = await ctx.prisma.research_post.findMany({
        where: {
          OR: [
            { title: { contains: input.query, mode: 'insensitive' } },
            { author: { contains: input.query, mode: 'insensitive' } },
            { category: { contains: input.query, mode: 'insensitive' } },
            {
              user: {
                profile: {
                  some: {
                    name: { contains: input.query, mode: 'insensitive' },
                  },
                },
              },
            },
          ],
        },
        orderBy: { created_at: 'desc' },
        include: {
          user: {
            include: {
              profile: true, // Include the profile information in the result
            },
          },
        },
      });
    
      console.log("researchPostsearch:", researchPosts);
      return researchPosts;
    }),

    //recommendations:
    getResearchPostRecommendations: protectedProcedure.query(async ({ ctx }) => {
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
    
      // Find research posts with at least 1 similar research interest
      const recommendedResearchPosts = await ctx.prisma.research_post.findMany({
        where: {
          user_id: {
            not: userId,
          },
          OR: userResearchInterests.map((interest) => ({
            profile: {
              research_interest: {
                contains: interest.trim(),
              },
            },
          })),
        },
        take: 10, // Limit the number of recommendations
        select: {
          post_id: true,
          user_id: true,
          category: true,
          title: true,
          author: true,
          description: true,
          document: true,
          created_at: true,
          // summary: true,
        },
      });
    
      return recommendedResearchPosts;
    }),

});