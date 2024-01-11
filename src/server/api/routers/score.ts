import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const scoreRouter = router({
  getCScore: protectedProcedure
    .input(
      z.object({
        project_id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { project_id } = input;

      const project = await ctx.prisma.project.findUnique({
        where: {
          project_id,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return project.c_score;
    }),

  getPScore: protectedProcedure
    .input(
      z.object({
        project_id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { project_id } = input;

      const project = await ctx.prisma.project.findUnique({
        where: {
          project_id,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return project.p_score;
    }),
});
