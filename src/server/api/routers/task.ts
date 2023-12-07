import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { router, protectedProcedure } from "~/server/api/trpc";

export const taskRouter = router({
  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { id } = input;

      const task = await ctx.prisma.task.findUnique({
        where: {
          id,
        },
      });

      if (!task) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Task not found" });
      }

      return task;
    }),

  list: protectedProcedure
    .input(
      z.object({
        phase_id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { phase_id } = input;

      const tasks = await ctx.prisma.task.findMany({
        where: {
          phase_id,
        },
        include: {
          user: true,
        },
      });

      return tasks;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        phase_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const task = await ctx.prisma.task.create({
        data: {
          ...input,
          created_at: new Date(),
        },
      });

      return task;
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, status } = input;

      let task;

      if (status === "done") {
        task = await ctx.prisma.task.update({
          where: { id },
          data: { status, end_at: new Date() },
        });
      } else {
        task = await ctx.prisma.task.update({
          where: { id },
          data: { status },
        });
      }

      // Get phase_id of task
      const phase_id = task.phase_id;

      // Fetch completed tasks for productivity calculation
      const completedTasks = await ctx.prisma.task.findMany({
        where: {
          phase_id,
          status: "done",
        },
      });
      // Update project productivity score
      const project = await ctx.prisma.phase
        .findUnique({
          where: { id: phase_id },
        })
        .project();

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }
      if (!completedTasks || completedTasks.length === 0) {
        await ctx.prisma.project.update({
          where: { project_id: project.project_id },
          data: { p_score: 0 },
        });
        return task; // No completed tasks, return the updated task without further calculations
      }

      // fetch all tasks of the phase
      const totalTasks = await ctx.prisma.task.findMany({
        where: {
          phase_id,
        },
      });

      const completionRatio =
        completedTasks.length > 0
          ? (completedTasks.length / totalTasks.length) * 100
          : 0;

      // const averageDuration =
      //   completedTasks.length > 0
      //     ? completedTasks.reduce(
      //         (total, task) =>
      //           total +
      //           (task.end_at instanceof Date
      //             ? task.end_at.getTime() - task.created_at.getTime()
      //             : 0),
      //         0
      //       ) / completedTasks.length
      //     : 0;

      // Customize the scoring method based on your specific requirements
      const completionScore = completionRatio;
      // const maxDuration = 86400000; // 24 hours in milliseconds
      // const durationScore = 100 - (averageDuration / maxDuration) * 100;

      // You may adjust the weights or combine the scores differently based on your needs
      // const weightedScore = (completionScore + durationScore) / 2;

      await ctx.prisma.project.update({
        where: { project_id: project.project_id },
        data: { p_score: completionScore },
      });

      return task;
    }),

  listTaskbyStatus: protectedProcedure
    .input(
      z.object({
        phase_id: z.string(),
        status: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { phase_id, status } = input;

      const tasks = await ctx.prisma.task.findMany({
        where: {
          phase_id,
          status,
        },
        include: {
          user: true,
        },
      });

      if (!tasks) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Tasks not found" });
      }

      return tasks;
    }),

  updateProperty: protectedProcedure
    .input(
      z.object({
        task_id: z.string(),
        property_id: z.string(),
        value: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { task_id, property_id, value } = input;

      const task = await ctx.prisma.property_phase_task.update({
        where: {
          task_id_property_id: {
            property_id,
            task_id,
          },
        },
        data: { value },
      });

      return task;
    }),
});
