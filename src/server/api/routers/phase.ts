import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const phaseRouter = router({
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
