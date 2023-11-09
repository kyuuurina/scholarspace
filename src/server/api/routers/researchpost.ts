// researchpost.ts

import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import * as trpc from "@trpc/server";
import { PrismaClient, research_post } from "@prisma/client";

const prisma = new PrismaClient();

export const postRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        category: z.string(),
        title: z.string(),
        description: z.string().nullable(),
        author: z.string(),
        document: z.string().nullable(), // Store the file path as a string
      })
    )
    .mutation(async ({ input }) => {
      const { document, ...data } = input;

      const post = await prisma.research_post.create({
        data: {
          ...input,
          document: "",
          post_id: String(Date.now()),
          user_id: "dummy-user-id", // Replace with the actual user ID
          title: "", // Set appropriate default values
          description: "", // Set appropriate default values
        },
      });

      return post;
    }),
  update: protectedProcedure
    .input(
      z.object({
        post_id: z.string(),
        category: z.string(),
        title: z.string(),
        description: z.string().optional(),
        author: z.string().optional(),
        document: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { post_id, ...data } = input;

      const updatedPost = await prisma.research_post.update({
        where: {
          post_id,
        },
        data,
      });

      return updatedPost;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { id } = input;

      await prisma.research_post.delete({
        where: {
          post_id: id,
        },
      });

      return { success: true };
    }),
});
