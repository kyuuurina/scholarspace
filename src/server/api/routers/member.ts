import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { clerkClient } from "@clerk/nextjs";

export const memberRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.member.findMany();
  }),
  get: publicProcedure
    .input(z.object({ memberId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.member.findUnique({
        where: {
          id: input.memberId,
        },
      });
    }),
  addMember: protectedProcedure
    .input(z.object({ id: z.string(), workspaceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const member = await ctx.prisma.member.create({
        data: {
          id: input.id,
          role: "Researcher",
          workspaceId: input.workspaceId,
        },
      });

      const user = await clerkClient.users.getUser(member.id);
      const name = user.firstName ?? ""; // Use empty string as default value if user.firstName is null
      const email = user.emailAddresses[0]?.emailAddress || "";
      const avatar = user.imageUrl;

      // Update the member record with the user's name, email, and avatar
      const updatedMember = await ctx.prisma.member.update({
        where: { id: member.id },
        data: { name, email, avatar },
      });

      return updatedMember;
    }),
  getWorkspaceMembers: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.member.findMany({
        where: {
          workspaceId: input.workspaceId,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        role: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, role } = input;

      const updatedMember = await ctx.prisma.member.update({
        where: {
          id,
        },
        data: {
          role,
        },
      });

      return updatedMember;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      await ctx.prisma.member
      .delete({
        where: {
          id,
        },
      });

      return { success: true };
    }),
});
