import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const commentRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        task_id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { task_id } = input;

      const comments = await ctx.prisma.comment.findMany({
        where: {
          task_id,
        },
      });

      if (!comments) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comments not found",
        });
      }

      return comments;
    }),

  create: protectedProcedure
    .input(
      z.object({
        value: z.string(),
        task_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const comment = await ctx.prisma.comment.create({
        data: {
          ...input,
          user_id: ctx.user.id,
        },
      });

      // calculate comments made by us over total comments ratio

      const comments = await ctx.prisma.comment.findMany({
        where: {
          task_id: input.task_id,
        },
      });

      const commentsByUser = comments.filter(
        (comment) => comment.user_id === ctx.user.id
      );

      const ratio = commentsByUser.length / comments.length;
      // turn ratio to over 100%
      const percent = Math.round(ratio * 100);

      // update p_score of project
      const task = await ctx.prisma.task.findUnique({
        where: {
          id: input.task_id,
        },
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }

      const phase = await ctx.prisma.phase.findUnique({
        where: {
          id: task.phase_id,
        },
      });

      if (!phase) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Phase not found",
        });
      }

      const project = await ctx.prisma.project.findUnique({
        where: {
          project_id: phase.project_id,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      // update project p_score
      await ctx.prisma.project.update({
        where: {
          project_id: project.project_id,
        },
        data: {
          c_score: percent,
        },
      });

      return comment;
    }),

  createReply: protectedProcedure
    .input(
      z.object({
        value: z.string(),
        task_id: z.string(),
        parent_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const comment = await ctx.prisma.comment.create({
        data: {
          ...input,
          user_id: ctx.user.id,
        },
      });

      return comment;
    }),

  edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        value: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const comment = await ctx.prisma.comment.update({
        where: {
          id: input.id,
        },
        data: {
          value: input.value,
        },
      });

      return comment;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const comment = await ctx.prisma.comment.delete({
        where: {
          id: input.id,
        },
      });

      return comment;
    }),
});
