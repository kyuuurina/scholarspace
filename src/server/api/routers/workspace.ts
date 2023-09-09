/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const workspaceRouter = router({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.workspace.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  listUserWorkspaces: protectedProcedure.query(async ({ ctx }) => {
    const userid = ctx.user.id;
    const workspaces = await ctx.prisma.workspace_user.findMany({
      where: {
        userid,
      },
      include: {
        workspace: true,
      },
    });
    return workspaces;
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        cover_img: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userid = ctx.user.id;

      const workspace = await ctx.prisma.workspace.create({
        data: {
          ...input,
        },
      });

      await ctx.prisma.workspace_user.create({
        data: {
          userid,
          workspaceid: workspace.id,
          workspace_role: "Researcher Admin",
        },
      });

      return workspace;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        cover_img: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, name, description, cover_img } = input;

      const updatedWorkspace = await ctx.prisma.workspace.update({
        where: {
          id,
        },
        data: {
          name,
          description,
          cover_img,
        },
      });
      console.log(updatedWorkspace);

      return updatedWorkspace;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      await ctx.prisma.workspace_user.deleteMany({
        where: {
          workspaceid: id,
        },
      });

      // Delete the workspace
      await ctx.prisma.workspace.delete({
        where: {
          id,
        },
      });

      return { success: true };
    }),

  listWorkspaceMembers: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const { id } = input;

      const members = await ctx.prisma.workspace_user.findMany({
        where: {
          workspaceid: id,
        },
        include: {
          users: true,
        },
      });

      return members;
    }),
});
