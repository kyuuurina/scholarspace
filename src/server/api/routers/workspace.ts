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
        include: {
          workspace_user: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!workspace) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "We're sorry, but the requested workspace could not be found.",
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
      orderBy: {
        workspace: {
          created_at: "desc",
        },
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
          ownerid: userid,
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
      // throw error if user is not admin
      const authUser = await ctx.prisma.workspace_user.findUnique({
        where: {
          workspaceid_userid: {
            workspaceid: id,
            userid: ctx.user.id,
          },
        },
      });

      if (authUser?.workspace_role !== "Researcher Admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });
      }

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

      return updatedWorkspace;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      // throw error if user is not admin
      const authUser = await ctx.prisma.workspace_user.findUnique({
        where: {
          workspaceid_userid: {
            workspaceid: id,
            userid: ctx.user.id,
          },
        },
      });

      if (authUser?.workspace_role !== "Researcher Admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });
      }

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
          user: {
            include: {
              profile: {
                select: {
                  name: true,
                  avatar_url: true,
                },
              },
            },
          },
        },
      });

      return members;
    }),

  addWorkspaceMember: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        email: z.string(),
        role: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { workspaceId, email, role } = input;

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

      try {
        const workspaceUser = await ctx.prisma.workspace_user.create({
          data: {
            workspaceid: workspaceId,
            userid: user.id,
            workspace_role: role,
            is_collaborator: true,
          },
        });

        const projects = await ctx.prisma.project.findMany({
          where: {
            workspace_id: workspaceId,
          },
        });

        if (projects?.length > 0) {
          for (const project of projects) {
            // Check if the user is already a member of the project
            const existingProjectUser =
              await ctx.prisma.project_users.findFirst({
                where: {
                  project_id: project.project_id,
                  user_id: user.id,
                },
              });

            if (!existingProjectUser) {
              // Proceed with creating the project_users record
              await ctx.prisma.project_users.create({
                data: {
                  project_id: project.project_id,
                  user_id: user.id,
                  project_role: role,
                  is_external_collaborator: false,
                },
              });
            } else {
              // Update the existing project_users record
              await ctx.prisma.project_users.update({
                where: {
                  user_id_project_id: {
                    project_id: project.project_id,
                    user_id: user.id,
                  },
                },
                data: {
                  project_role: role,
                  is_external_collaborator: false, // Update is_external_collaborator to false
                },
              });
            }
          }
        }

        return workspaceUser;
      } catch (error) {
        if (error instanceof Error) {
          const errnoError = error as NodeJS.ErrnoException;
          if (errnoError.code === "P2002") {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "User is already a member of the workspace",
            });
          }
        }
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

      // allow authenticated user to have researcher admin role only to do this update role procedure
      const authUser = await ctx.prisma.workspace_user.findUnique({
        where: {
          workspaceid_userid: {
            workspaceid: workspaceId,
            userid: ctx.user.id,
          },
        },
      });

      if (authUser?.workspace_role !== "Researcher Admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });
      }

      // checks if workspace only has one researcher admin when role is changed to researcher
      if (role === "Researcher") {
        const workspace = await ctx.prisma.workspace.findUnique({
          where: {
            id: workspaceId,
          },
          include: {
            workspace_user: true,
          },
        });
        // check if after leave, there will be no researcher admin left
        const researcherAdmins = workspace?.workspace_user.filter(
          (user) => user.workspace_role === "Researcher Admin"
        );

        if (
          researcherAdmins?.length === 1 &&
          researcherAdmins[0]?.userid === userId
        ) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Workspace must have at least one researcher admin.",
          });
        }
      }

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

      // throw error if signed in user is not admin
      const authUser = await ctx.prisma.workspace_user.findUnique({
        where: {
          workspaceid_userid: {
            workspaceid: workspaceId,
            userid: ctx.user.id,
          },
        },
      });

      if (authUser?.workspace_role !== "Researcher Admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });
      }

      // remove workspace member from other projects as well
      const projects = await ctx.prisma.project.findMany({
        where: {
          workspace_id: workspaceId,
        },
      });

      if (projects?.length > 0) {
        for (const project of projects) {
          await ctx.prisma.project_users.delete({
            where: {
              user_id_project_id: {
                project_id: project.project_id,
                user_id: userId,
              },
            },
          });
        }
      }

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

  getWorkspaceRole: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const authUser = await ctx.prisma.workspace_user.findUnique({
        where: {
          workspaceid_userid: {
            workspaceid: input.workspaceId,
            userid: ctx.user.id,
          },
        },
      });
      return authUser?.workspace_role;
    }),

  leave: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // throw error if there will be no researcher admin left when leaving workspace
      const workspace = await ctx.prisma.workspace.findUnique({
        where: {
          id: input.workspaceId,
        },
        include: {
          workspace_user: true,
        },
      });

      const researcherAdmins = workspace?.workspace_user.filter(
        (user) => user.workspace_role === "Researcher Admin"
      );

      if (
        researcherAdmins?.length === 1 &&
        researcherAdmins[0]?.userid === ctx.user.id
      ) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Workspace must have at least one researcher admin.",
        });
      }

      const workspaceUser = await ctx.prisma.workspace_user.delete({
        where: {
          workspaceid_userid: {
            workspaceid: input.workspaceId,
            userid: ctx.user.id,
          },
        },
      });

      return workspaceUser;
    }),
});
