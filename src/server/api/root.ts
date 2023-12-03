import { workspaceRouter } from "~/server/api/routers/workspace";
import { memberRouter } from "~/server/api/routers/member";
import { accountRouter } from "./routers/account";
import { router } from "~/server/api/trpc";
import { postRouter } from "~/server/api/routers/researchpost";
import profileRouter from "./routers/profile";
import { userRouter } from "./routers/user";
import { projectRouter } from "./routers/project";
import { phaseRouter } from "./routers/phase";

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
  researchpost: postRouter,
  user: userRouter,
  project: projectRouter,
  phase: phaseRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
