// post.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { PrismaClient, ResearchPosts } from "@prisma/client";

const prisma = new PrismaClient();

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        author: z.string(),
        document: z.string(), // Assuming you want to store the file path as a string
        comments: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { document, ...data } = input;

      const post = await prisma.researchPosts.create({
        data: {
          ...data,
          document,
          id: String(Date.now()),
          userId: "dummy-user-id", // Replace with the actual user ID
          name: "", // Set appropriate default values
          avatar: "", // Set appropriate default values
          content: "", // Set appropriate default values
        },
      });

      return post;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        author: z.string().optional(),
        document: z.string().optional(),
        comments: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      const updatedPost = await prisma.researchPosts.update({
        where: {
          id,
        },
        data,
      });

      return updatedPost;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { id } = input;

      await prisma.researchPosts.delete({
        where: {
          id,
        },
      });

      return { success: true };
    }),
});
