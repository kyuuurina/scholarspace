import { router } from "~/server/api/trpc";
import { accountRouter } from "./routers/account";
import { userRouter } from "./routers/user";
import { workspaceRouter } from "~/server/api/routers/workspace";
import { projectRouter } from "./routers/project";
import { memberRouter } from "~/server/api/routers/member";
import { researchpostRouter } from "~/server/api/routers/researchpost";
import { profileRouter } from "./routers/profile";
import { researchInterestRouter } from "./routers/research-interest";
import { researchSkillRouter } from "./routers/research-skill";
import { educationRouter } from "./routers/education";
import { experienceRouter } from "./routers/experience";
import { achievementRouter } from "./routers/achievement";
import { followRouter } from "./routers/follow";
import { likeRouter } from "./routers/postlike";
import { postCommentRouter } from "./routers/postcomment";
import { chatRouter} from "./routers/chatmessage";
import { phaseRouter } from "./routers/phase";
import { taskRouter } from "./routers/task";
import { commentRouter } from "./routers/comment";
import { scoreRouter } from "./routers/score";
import { reactionRouter } from "./routers/reaction";
import { notificationsRouter } from "./routers/notifications";

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
  reaction: reactionRouter,
  researchInterest: researchInterestRouter,
  researchSkill: researchSkillRouter,
  education: educationRouter,
  achievement: achievementRouter,
  experience: experienceRouter,
  researchpost: researchpostRouter,
  user: userRouter,
  project: projectRouter,
  phase: phaseRouter,
  task: taskRouter,
  comment: commentRouter,
  score: scoreRouter,
  follow: followRouter,
  postlike: likeRouter,
  postcomment: postCommentRouter,
  chat: chatRouter,
  notifications: notificationsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
