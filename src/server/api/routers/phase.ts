import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const phaseRouter = router({
  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { id } = input;

      const phase = await ctx.prisma.phase.findUnique({
        where: {
          id,
        },
      });

      if (!phase) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Phase not found" });
      }

      return phase;
    }),

  list: protectedProcedure
    .input(
      z.object({
        project_id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { project_id } = input;

      const phases = await ctx.prisma.phase.findMany({
        where: {
          project_id,
        },
      });

      if (!phases) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Phase not found" });
      }

      return phases;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        project_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const phase = await ctx.prisma.phase.create({
        data: {
          ...input,
          start_at: new Date(),
        },
      });

      // create one default task
      await ctx.prisma.task.create({
        data: {
          name: "Default task",
          phase_id: phase.id,
          created_at: new Date(),
        },
      });

      return phase;
    }),

  addProperty: protectedProcedure
    .input(
      z.object({
        phase_id: z.string(),
        name: z.string(),
        value: z.string(),
        type: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { phase_id, name, value, type } = input;

      const property = await ctx.prisma.phase_property.create({
        data: {
          name,
          type,
          phase_id,
        },
      });

      // checks if the phase contains any tasks
      // if yes, then iterate over them and create a property value for each
      const tasks = await ctx.prisma.task.findMany({
        where: {
          phase_id,
        },
      });

      // Fetch existing property_phases records for the given phase_id
      const phase_property = await ctx.prisma.phase_property.findMany({
        where: {
          phase_id,
        },
      });

      // Determine the length of existing tasks and increment by 1 to get the next index
      const nextIndex = phase_property.length - 1;

      if (tasks) {
        for (const task of tasks) {
          await ctx.prisma.property_phase_task.create({
            data: {
              task_id: task.id,
              property_id: property.id,
              phase_id,
              value,
              index: nextIndex,
            },
          });
        }
      }

      return property;
    }),

  // return property according to index value
  getPropertyValues: protectedProcedure
    .input(
      z.object({
        phase_id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { phase_id } = input;

      const propertyValues = await ctx.prisma.property_phase_task.findMany({
        where: {
          phase_id,
        },
      });

      return propertyValues;
    }),

  getProperties: protectedProcedure
    .input(
      z.object({
        phase_id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { phase_id } = input;

      const properties = await ctx.prisma.phase_property.findMany({
        where: {
          phase_id,
        },
      });

      return properties;
    }),

  getProperty: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { id } = input;

      const property = await ctx.prisma.phase_property.findUnique({
        where: {
          id,
        },
      });

      return property;
    }),

  deleteProperty: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      const property = await ctx.prisma.phase_property.delete({
        where: {
          id,
        },
      });

      return property;
    }),

  deletePhase: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      // if tasks exist, delete them first
      const tasks = await ctx.prisma.task.findMany({
        where: {
          phase_id: id,
        },
      });

      if (tasks) {
        await ctx.prisma.task.deleteMany({
          where: {
            phase_id: id,
          },
        });
      }

      // if there is only one phase after delete, throw error
      const phases = await ctx.prisma.phase.findMany({
        where: {
          project_id: id,
        },
      });

      if (phases.length - 1 === 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot delete the last phase",
        });
      }

      const phase = await ctx.prisma.phase.delete({
        where: {
          id,
        },
      });

      return phase;
    }),
});
