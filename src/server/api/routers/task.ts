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
      });

      return tasks;
    }),

  listByProject: protectedProcedure
    .input(
      z.object({
        project_id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { project_id } = input;

      const tasks = await ctx.prisma.task.findMany({
        where: {
          phase: {
            project_id,
          },
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
        value: z.string().nullable(),
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

  getAssignees: protectedProcedure
    .input(
      z.object({
        phase_id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { phase_id } = input;

      const assignees = await ctx.prisma.task_assignees.findMany({
        where: {
          phase_id,
        },
        include: {
          user: true,
        },
      });

      if (assignees.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Task not found" });
      }

      return assignees;
    }),

  getTaskAssignees: protectedProcedure
    .input(
      z.object({
        task_id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { task_id } = input;

      const assignees = await ctx.prisma.task_assignees.findMany({
        where: {
          task_id,
        },
        include: {
          user: true,
        },
      });

      if (assignees.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Task not found" });
      }

      return assignees;
    }),

  addTaskRow: protectedProcedure
    .input(
      z.object({
        phase_id: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { phase_id } = input;

      const task = await ctx.prisma.task.create({
        data: {
          ...input,
          created_at: new Date(),
        },
      });

      // get properties of phase
      const properties = await ctx.prisma.phase_property.findMany({
        where: {
          phase_id,
        },
      });

      const nextIndex = properties.length - 1;

      // create phase_property_task row for each phase property
      await Promise.all(
        properties.map((property) =>
          ctx.prisma.property_phase_task.create({
            data: {
              task_id: task.id,
              property_id: property.id,
              phase_id,
              index: nextIndex,
            },
          })
        )
      );
      return task;
    }),

  updateTaskName: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, name } = input;

      const task = await ctx.prisma.task.update({
        where: { id },
        data: { name },
      });

      return task;
    }),

  getPropertyValues: protectedProcedure
    .input(
      z.object({
        task_id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { task_id } = input;

      const propertyValues = await ctx.prisma.property_phase_task.findMany({
        where: {
          task_id,
        },
      });

      return propertyValues;
    }),

  updateDescription: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, description } = input;

      const task = await ctx.prisma.task.update({
        where: { id },
        data: { description },
      });

      return task;
    }),

  uploadAttachment: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        attachments: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, attachments } = input;

      const task = await ctx.prisma.task.update({
        where: { id },
        data: { attachments },
      });

      return task;
    }),

  updateStartDate: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        created_at: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, created_at } = input;

      const task = await ctx.prisma.task.update({
        where: { id },
        data: { created_at },
      });

      return task;
    }),

  updateDeadline: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        deadline: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, deadline } = input;

      const task = await ctx.prisma.task.update({
        where: { id },
        data: { deadline },
      });

      // get tasks and get the latest deadline
      const tasks = await ctx.prisma.task.findMany({
        where: {
          phase_id: task.phase_id,
        },
      });

      const latestDeadline = tasks.reduce((prev, current) =>
        prev.deadline && current.deadline && prev.deadline > current.deadline
          ? prev
          : current
      );

      // update phase deadline
      await ctx.prisma.phase.update({
        where: { id: task.phase_id },
        data: { end_at: latestDeadline.deadline },
      });

      console.log(latestDeadline.deadline);

      return task;
    }),

  updateAssignees: protectedProcedure
    .input(
      z.object({
        task_id: z.string(),
        assignees: z.array(z.string()),
        phase_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { task_id, assignees, phase_id } = input;

      // delete all assignees of the task
      await ctx.prisma.task_assignees.deleteMany({
        where: {
          task_id,
        },
      });

      // create new assignees
      await Promise.all(
        assignees.map((assignee) =>
          ctx.prisma.task_assignees.create({
            data: {
              task_id,
              assignee_id: assignee,
              phase_id,
            },
          })
        )
      );

      return true;
    }),
});
