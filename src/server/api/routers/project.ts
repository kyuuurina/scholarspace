import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const projectRouter = router({
  get: protectedProcedure
    .input(z.object({ project_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: {
          project_id: input.project_id,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      const projectUsers = await ctx.prisma.project_users.findMany({
        where: {
          project_id: input.project_id,
        },
      });

      const users = await Promise.all(
        projectUsers.map((projectUser) =>
          ctx.prisma.user.findUnique({
            where: {
              id: projectUser.user_id,
            },
          })
        )
      );

      return {
        ...project,
        users,
      };
    }),

  // get projects under a workspace
  getWorkspaceProjects: protectedProcedure
    .input(z.object({ workspace_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const workspaceUser = await ctx.prisma.workspace_user.findUnique({
        where: {
          workspaceid_userid: {
            workspaceid: input.workspace_id,
            userid: ctx.user.id,
          },
        },
      });

      if (!workspaceUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to view this workspace",
        });
      }

      const projects = await ctx.prisma.project.findMany({
        where: {
          workspace_id: input.workspace_id,
        },
      });

      return projects;
    }),

  // get user role of a project
  getProjectUserRole: protectedProcedure
    .input(z.object({ project_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const projectUser = await ctx.prisma.project_users.findUnique({
        where: {
          user_id_project_id: {
            user_id: ctx.user.id,
            project_id: input.project_id,
          },
        },
      });

      if (!projectUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to view this project",
        });
      }

      // return project role and is_external_collaborator
      return {
        project_role: projectUser.project_role,
        is_external_collaborator: projectUser.is_external_collaborator,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        workspace_id: z.string(),
        name: z.string(),
        description: z.string(),
        cover_img: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const workspaceUser = await ctx.prisma.workspace_user.findUnique({
        where: {
          workspaceid_userid: {
            workspaceid: input.workspace_id,
            userid: ctx.user.id,
          },
        },
      });

      // if user is not researcher admin, throw error
      if (
        !workspaceUser ||
        workspaceUser.workspace_role !== "Researcher Admin"
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to create a project",
        });
      }

      const project = await ctx.prisma.project.create({
        data: {
          ...input,
        },
      });

      // get all workspace users
      const workspaceUsers = await ctx.prisma.workspace_user.findMany({
        where: {
          workspaceid: input.workspace_id,
        },
      });

      // add all workspace users to project
      await Promise.all(
        workspaceUsers.map((workspaceUser) =>
          ctx.prisma.project_users.create({
            data: {
              user_id: workspaceUser.userid,
              project_id: project.project_id,
              project_role: workspaceUser.workspace_role,
            },
          })
        )
      );

      return project;
    }),

  update: protectedProcedure
    .input(
      z.object({
        project_id: z.string(),
        name: z.string(),
        description: z.string(),
        cover_img: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const projectUser = await ctx.prisma.project_users.findUnique({
        where: {
          user_id_project_id: {
            user_id: ctx.user.id,
            project_id: input.project_id,
          },
        },
      });

      // if user is not researcher admin, throw error
      if (!projectUser || projectUser.project_role !== "Researcher Admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to update this project",
        });
      }

      const project = await ctx.prisma.project.update({
        where: {
          project_id: input.project_id,
        },
        data: {
          ...input,
        },
      });

      return project;
    }),

  leave: protectedProcedure
    .input(z.object({ project_id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const projectUser = await ctx.prisma.project_users.findUnique({
        where: {
          user_id_project_id: {
            user_id: ctx.user.id,
            project_id: input.project_id,
          },
        },
      });

      // if user does not exists, throw an error
      if (!projectUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User does not exist in this project",
        });
      }

      // if there's only one user left in the project, throw an error
      const projectUsers = await ctx.prisma.project_users.findMany({
        where: {
          project_id: input.project_id,
        },
      });

      if (projectUsers.length === 1) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are the only user in this project",
        });
      }

      await ctx.prisma.project_users.delete({
        where: {
          user_id_project_id: {
            user_id: ctx.user.id,
            project_id: input.project_id,
          },
        },
      });

      return true;
    }),

  delete: protectedProcedure
    .input(z.object({ project_id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const projectUser = await ctx.prisma.project_users.findUnique({
        where: {
          user_id_project_id: {
            user_id: ctx.user.id,
            project_id: input.project_id,
          },
        },
      });

      console.log(projectUser);

      // if user is not researcher admin, throw error
      if (projectUser?.project_role !== "Researcher Admin") {
        console.log(projectUser?.project_role);
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to delete this project",
        });
      }

      // delete all project_users record first
      await ctx.prisma.project_users.deleteMany({
        where: {
          project_id: input.project_id,
        },
      });

      await ctx.prisma.project.delete({
        where: {
          project_id: input.project_id,
        },
      });

      return true;
    }),
});
