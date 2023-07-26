/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const workspaceRouter = router({
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
    const userId = ctx.user.id;
    const workspaces = await ctx.prisma.workspace.findMany({
      where: {
        userId,
      },
    });
    return workspaces;
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string(), description: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;

      const workspace = await ctx.prisma.workspace.create({
        data: {
          ...input,
          userId: ctx.user.id,
        },
      });

      //     const member = await ctx.prisma.member.create({
      //       data: {
      //         role: "Researcher Admin", // Set the desired role for the user
      //         workspaceId: workspace.id,
      //         userId: userId,
      //       },
      //     });

      //     const user = await clerkClient.users.getUser(userId);
      //     const name = user.firstName ?? ""; // Use empty string as default value if user.firstName is null
      //     const email = user.emailAddresses[0]?.emailAddress || "";
      //     const avatar = user.imageUrl;

      //     // Update the member record with the user's name, email, and avatar
      //     await ctx.prisma.member.update({
      //       where: { id: member.id },
      //       data: { name, email, avatar },
      //     });

      return workspace;
    }),

  // update: protectedProcedure
  //   .input(
  //     z.object({
  //       workspaceId: z.string(),
  //       name: z.string(),
  //       description: z.string(),
  //     })
  //   )
  //   .mutation(async ({ input, ctx }) => {
  //     const { workspaceId, name, description } = input;

  //     const updatedWorkspace = await ctx.prisma.workspace.update({
  //       where: {
  //         id: workspaceId,
  //       },
  //       data: {
  //         name,
  //         description,
  //       },
  //     });

  //     return updatedWorkspace;
  //   }),

  // delete: protectedProcedure
  //   .input(z.object({ workspaceId: z.string() }))
  //   .mutation(async ({ input, ctx }) => {
  //     const { workspaceId } = input;

  //     // Delete all members associated with the workspace
  //     await ctx.prisma.member.deleteMany({
  //       where: {
  //         workspaceId,
  //       },
  //     });

  //     // Delete the workspace
  //     await ctx.prisma.workspace.delete({
  //       where: {
  //         id: workspaceId,
  //       },
  //     });

  //     return { success: true };
  //   }),
});
