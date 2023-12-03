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
        start_at: z.date(),
        end_at: z.date(),
        project_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const phase = await ctx.prisma.phase.create({
        data: {
          ...input,
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
});
