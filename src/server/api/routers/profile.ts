import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getAllUsers: publicProcedure.query(async () => {
    const users = await clerkClient.users.getUserList();

    if (!users || users.length === 0) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "No users found",
      });
    }

    return users;
  }),
});
