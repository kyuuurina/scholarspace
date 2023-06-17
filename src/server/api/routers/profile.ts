import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.workspace.findUnique({
        where: {
          id: input.workspaceId,
        },
      });
    }),
  list: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.userId;
    const workspaces = await ctx.prisma.workspace.findMany({
      where: {
        userId,
      },
    });

    // Extract and return the workspace names
    return workspaces;
  }),
  create: protectedProcedure
    .input(z.object({ name: z.string(), description: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const workspace = await ctx.prisma.workspace.create({
        data: {
          ...input,
          userId: ctx.auth.userId,
        },
      });
      return workspace;
    }),
  update: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        name: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { workspaceId, name, description } = input;

      const updatedWorkspace = await ctx.prisma.workspace.update({
        where: {
          id: workspaceId,
        },
        data: {
          name,
          description,
        },
      });

      return updatedWorkspace;
    }),
  delete: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { workspaceId } = input;

      await ctx.prisma.workspace.delete({
        where: {
          id: workspaceId,
        },
      });

      return { success: true };
    }),
});
