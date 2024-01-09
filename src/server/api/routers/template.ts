import { z } from "zod";
import { router, protectedProcedure } from "~/server/api/trpc";

import { TRPCError } from "@trpc/server";

export const templateRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      const templates = await ctx.prisma.phase_template.findMany({
        where: {
          user_id: ctx.user.id,
        },
      });

      return templates;
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching templates",
      });
    }
  }),

  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const template = await ctx.prisma.phase_template.findUnique({
        where: {
          id: input.id,
        },
      });
      return template;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        phase_template_properties: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.phase_template_properties.length < 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Phase template must have at least one property",
        });
      }
      const template = await ctx.prisma.phase_template.create({
        data: {
          ...input,
          user_id: ctx.user.id,
        },
      });

      return template;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const template = await ctx.prisma.phase_template.delete({
        where: {
          id: input.id,
        },
      });

      return template;
    }),
});
