// import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

import { router, publicProcedure } from "~/server/api/trpc";

export const accountRouter = router({
  // getAllUsers: publicProcedure.query(async () => {
  //   const users = await clerkClient.users.getUserList();
  //   if (!users || users.length === 0) {
  //     throw new TRPCError({
  //       code: "INTERNAL_SERVER_ERROR",
  //       message: "No users found",
  //     });
  //   }
  //   return users;
  // }),

  // router to add member
});
