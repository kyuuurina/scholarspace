import { router } from "~/server/api/trpc";
import { accountRouter } from "./routers/account";
import { userRouter } from "./routers/user";
import { workspaceRouter } from "~/server/api/routers/workspace";
import { projectRouter } from "./routers/project";
import { memberRouter } from "~/server/api/routers/member";
import { researchpostRouter } from "~/server/api/routers/researchpost";
import  { profileRouter }  from "./routers/profile";
import { educationRouter } from "./routers/education";
import { experienceRouter } from "./routers/experience";
import { achievementRouter } from "./routers/achievement";



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
  education: educationRouter,
  achievement: achievementRouter,
  experience: experienceRouter,
  researchpost: researchpostRouter,
  user: userRouter,
  project: projectRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
