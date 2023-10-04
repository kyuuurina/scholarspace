import { workspaceRouter } from "~/server/api/routers/workspace";
import { memberRouter } from "~/server/api/routers/member";
import { accountRouter } from "./routers/account";
import { router } from "~/server/api/trpc";
import profileRouter from "./routers/profile";
import { postRouter } from "~/server/api/routers/post";
//import { forgotPasswordProcedure } from "~/server/api/trpc";  //to-do:relocate to accountRouter

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  workspace: workspaceRouter,
  member: memberRouter,
  account: accountRouter,
  profile: profileRouter,
  post: postRouter,
  //forgotPassword: forgotPasswordProcedure,
});

// export type definition of API
export type AppRouter = typeof appRouter;
