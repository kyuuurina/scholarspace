import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "~/server/api/trpc";
import { each } from "chart.js/dist/helpers/helpers.core";

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
        project_id: z.array(z.string()).optional(),
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
          name: input.name,
          start_at: input.start_at,
          end_at: input.end_at,
          workspace_id: input.workspace_id,
        },
      });

      // if project_id is not null, update project with grant id
      // iterate each project_id
      if (input.project_id && input.project_id.length > 0) {
        await Promise.all(
          (input.project_id || []).map(async (project_id) => {
            await ctx.prisma.project.update({
              where: {
                project_id: project_id,
              },
              data: {
                grant_id: grant.id,
              },
            });
          })
        );
      }
    }),

  delete: protectedProcedure
    .input(
      z.object({
        grant_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { grant_id } = input;
      // remove grant id from project record first
      const projects = await ctx.prisma.project.findMany({
        where: {
          grant_id,
        },
      });

      if (projects.length > 0) {
        await Promise.all(
          projects.map(async (project) => {
            await ctx.prisma.project.update({
              where: {
                project_id: project.project_id,
              },
              data: {
                grant_id: null,
              },
            });
          })
        );
      }

      // delete grant
      await ctx.prisma.grant.delete({
        where: {
          id: grant_id,
        },
      });
    }),
});
