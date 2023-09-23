import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const workspaceRouter = router({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const workspace = await ctx.prisma.workspace.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!workspace) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workspace not found",
        });
      }

      return workspace;
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
          user: true,
        },
      });

      return members;
    }),

  addWorkspaceMember: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        email: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { workspaceId, email } = input;

      const user = await ctx.prisma.user.findFirst({
        where: {
          email: email,
        },
      });

      if (!user) {
        // User with the provided email does not exist, throw an error
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User with this email does not exist.",
        });
      }

      const owner = await ctx.prisma.workspace_user.findFirst({
        where: {
          workspaceid: workspaceId,
          is_collaborator: false,
        },
      });

      try {
        const workspaceUser = await ctx.prisma.workspace_user.create({
          data: {
            workspaceid: workspaceId,
            userid: user.id,
            workspace_role: "Researcher",
            is_collaborator: true,
            ownerid: owner?.userid,
          },
        });

        return workspaceUser;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add member to workspace",
        });
      }
    }),

  updateRole: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        userId: z.string(),
        role: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { workspaceId, userId, role } = input;

      const workspaceUser = await ctx.prisma.workspace_user.update({
        where: {
          workspaceid_userid: {
            workspaceid: workspaceId,
            userid: userId,
          },
        },
        data: {
          workspace_role: role,
        },
      });

      return workspaceUser;
    }),

  deleteWorkspaceMember: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { workspaceId, userId } = input;

      const workspaceUser = await ctx.prisma.workspace_user.delete({
        where: {
          workspaceid_userid: {
            workspaceid: workspaceId,
            userid: userId,
          },
        },
      });

      return workspaceUser;
    }),
});
