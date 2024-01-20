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
        select: {
          id: true,
          name: true,
          profile: {
            select: {
              profile_id: true,
              name: true,
              avatar_url: true,
            },
          },
        },
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
        name: post.user.profile.name,
        avatar_url: post.user.profile.avatar_url,
        profile_id: post.user.profile.profile_id,
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
      console.log("Help Me", post_id);
      const post = await ctx.prisma.research_post.findUnique({
        where: {
          post_id,
        },
      });
      console.log("Amdwae", post);
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

  getMyPosts: protectedProcedure
    .input(z.object({ post_id: z.string() }))
    .query(async ({ input, ctx }) => {
      const myPosts = await ctx.prisma.research_post.findMany({
        where: {
          profile_id: input.post_id,
        },
        orderBy: {
          created_at: "desc", // Order by created_at in descending order
        },
        include: {
          user: {
            select: {
              profile: true, // Include the entire profile table
            },
          },
        },
      });

      return myPosts.map((post) => {
        return {
          post_id: post.post_id,
          user_id: post.user_id,
          category: post.category,
          title: post.title,
          document: post.document,
          description: post.description,
          author: post.author,
          created_at: post.created_at,
          user: post.user,
        };
      });
    }),

  getFollowingPosts: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input: { limit = 10, cursor }, ctx }) => {
      const { user } = ctx;

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
      const followingUserIds = followingUsers.map(
        (user) => user.following_id
      ) as string[];

      const researchPosts = await ctx.prisma.research_post.findMany({
        take: limit + 1,
        cursor: cursor ? { post_id: cursor } : undefined,
        orderBy: [{ created_at: "desc" }, { post_id: "desc" }],
        where: { user_id: { in: followingUserIds } },
        select: {
          post_id: true,
          user_id: true,
          category: true,
          title: true,
          document: true,
          author: true,
          description: true,
          created_at: true,
          profile: {
            select: {
              profile_id: true,
              user_id: true,
              name: true,
              avatar_url: true,
            },
          },
        },
      });

      let nextCursor: string | undefined;
      if (researchPosts.length > limit) {
        const nextItem = researchPosts.pop();
        if (nextItem != null) {
          nextCursor = nextItem.post_id;
        }
      }

      return {
        researchPosts: researchPosts.map((post: any) => {
          return {
            post_id: post.post_id,
            user_id: post.user_id,
            category: post.category,
            title: post.title,
            document: post.document,
            description: post.description,
            author: post.author,
            created_at: post.created_at,
            name: post.profile.name,
            avatar_url: post.profile.avatar_url,
            profile_id: post.profile.profile_id,
          };
        }),
        nextCursor,
      };
    }),

  // Get research posts liked by the user
  getLikedPostsByUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user?.id;

    if (!userId) {
      // Handle unauthenticated user
      return [];
    }

    // Get the user's liked posts
    const likedPosts = await ctx.prisma.post_likes.findMany({
      where: {
        user_id: userId,
      },
      select: {
        post_id: true,
      },
    });

    // Extract post IDs
    const likedPostIds = likedPosts.map((post) => post.post_id);

    // Get research posts liked by the user
    const likedResearchPosts = await ctx.prisma.research_post.findMany({
      where: {
        post_id: {
          in: likedPostIds,
        },
      },
      include: {
        user: {
          include: {
            profile: {
              select: {
                profile_id: true,
                name: true,
                avatar_url: true,
              },
            },
          },
        },
      },
    });

    return likedResearchPosts;
  }),

  // Get research posts created by followed users
  getResearchPostsByFollowedUsers: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user?.id;

    if (!userId) {
      // Handle unauthenticated user
      return [];
    }

    // Get the user's followed users
    const followedUsers = await ctx.prisma.follow.findMany({
      where: {
        follower_id: userId,
      },
      select: {
        following_id: true,
      },
    });

    // Extract followed user IDs
    const followedUserIds = followedUsers.map((user) => user.following_id);

    // Get research posts created by followed users
    const researchPostsByFollowedUsers =
      await ctx.prisma.research_post.findMany({
        where: {
          user_id: {
            in: followedUserIds,
          },
        },
        select: {
          post_id: true,
          user_id: true,
          category: true,
          title: true,
          author: true,
          description: true,
          document: true,
          created_at: true,
          summary: true,
          profile: {
            select: {
              profile_id: true,
              user_id: true,
              name: true,
              avatar_url: true,
              about_me: true,
              research_interest: true,
              collab_status: true,
              skills: true,
            },
          },
        },
      });

    return researchPostsByFollowedUsers;
  }),

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
      // Handle the case where the user has no specified research interests
      // Provide default recommendations or other strategies
      const defaultRecommendations = await ctx.prisma.research_post.findMany({
        orderBy: { created_at: "desc" },
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
          summary: true,
          profile: {
            select: {
              profile_id: true,
              user_id: true,
              name: true,
              avatar_url: true,
              about_me: true,
              research_interest: true,
              collab_status: true,
              skills: true,
            },
          },
        },
      });

      return defaultRecommendations;
    }

    // Continue with the existing logic for users with specified research interests
    const userResearchInterests = user.research_interest
      .toLowerCase()
      .split(",");

    // Combine conditions using OR
    const recommendedResearchPosts = await ctx.prisma.research_post.findMany({
      where: {
        user_id: {
          not: userId,
        },
        OR: userResearchInterests.map((interest) => ({
          OR: [
            { title: { contains: interest.trim(), mode: "insensitive" } },
            {
              profile: {
                research_interest: { contains: interest.trim().toLowerCase() },
              },
            },
          ],
        })),
      },
      orderBy: { created_at: "desc" }, // Order by created_at in descending order
      // take: 10, // Limit the number of recommendations
      select: {
        post_id: true,
        user_id: true,
        category: true,
        title: true,
        author: true,
        description: true,
        document: true,
        created_at: true,
        summary: true,
        profile: {
          select: {
            profile_id: true,
            user_id: true,
            name: true,
            avatar_url: true,
            about_me: true,
            research_interest: true,
            collab_status: true,
            skills: true,
          },
        },
      },
    });

    return recommendedResearchPosts;
  }),

  //old recommendation
  // getResearchPostRecommendations: protectedProcedure.query(async ({ ctx }) => {
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

  //   const userResearchInterests = user.research_interest.toLowerCase().split(",");

  //   // Combine conditions using OR
  //   const recommendedResearchPosts = await ctx.prisma.research_post.findMany({
  //     where: {
  //       user_id: {
  //         not: userId,
  //       },
  //       OR: userResearchInterests.map((interest) => ({
  //         OR: [
  //           { title: { contains: interest.trim(), mode: 'insensitive' } },
  //           { profile: { research_interest: { contains: interest.trim().toLowerCase() } } },
  //         ],
  //       })),
  //     },
  //     orderBy: { created_at: 'desc' }, // Order by created_at in descending order
  //     // take: 10, // Limit the number of recommendations
  //     select: {
  //       post_id: true,
  //       user_id: true,
  //       category: true,
  //       title: true,
  //       author: true,
  //       description: true,
  //       document: true,
  //       created_at: true,
  //       summary: true,
  //       profile: {
  //         select: {
  //           profile_id: true,
  //           user_id: true,
  //           name: true,
  //           avatar_url: true,
  //           about_me: true,
  //           research_interest: true,
  //           collab_status: true,
  //           skills: true,
  //         },
  //       },
  //     },
  //   });

  //   return recommendedResearchPosts;
  // }),
});
