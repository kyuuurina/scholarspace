

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { Prisma, PrismaClient } from "@prisma/client";



export const searchRouter = router({
//search research post function
searchPost: publicProcedure
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
              // profile: true, // Include the profile information in the result
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

      console.log("searchPost:", researchPosts);
      return researchPosts;
    }),


// search profile function
  searchProfile: publicProcedure
  .input(
    z.object({
      query: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    const profiles = await ctx.prisma.profile.findMany({
      where: {
        name: { contains: input.query, mode: 'insensitive' },
      },
      select: {
        profile_id: true,
        name: true,
        avatar_url: true,
        collab_status: true,
      },
    });

    console.log("searchProfile:", profiles);
    return profiles;
  }),

});