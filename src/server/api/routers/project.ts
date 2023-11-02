import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const projectRouter = router({
  // get: publicProcedure
  //   .input(z.object({ id: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     const project = await ctx.prisma.project.findUnique({
  //       where: {
  //         project_id: input.id,
  //       },
  //     });

  //     if (!project) {
  //       throw new TRPCError({
  //         code: "NOT_FOUND",
  //         message: "Workspace not found",
  //       });
  //     }

  //     return project;
  //   }),

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
});
