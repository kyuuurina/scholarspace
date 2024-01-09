import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "~/server/api/trpc";

export const grantRouter = router({
  listByWorkspace: protectedProcedure
    .input(
      z.object({
        workspace_id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { workspace_id } = input;
      const grants = await ctx.prisma.grant.findMany({
        where: {
          workspace_id,
        },
      });

      return grants;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        start_at: z.date(),
        end_at: z.date().nullable(),
        workspace_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // if end date is before start date
      if (input.end_at && input.end_at < input.start_at) {
        // throw trpc error
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "End date must be after start date",
        });
      }
      const grant = await ctx.prisma.grant.create({
        data: {
          ...input,
        },
      });

      return grant;
    }),
});
