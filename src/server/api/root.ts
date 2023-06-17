import { workspaceRouter } from "~/server/api/routers/workspace";
import { memberRouter } from "~/server/api/routers/member";
import { accountRouter } from "./routers/account";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  workspace: workspaceRouter,
  member: memberRouter,
  account: accountRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
