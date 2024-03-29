/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

import { type Context } from "~/server/context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;

// Reusable middleware to ensure users are logged in
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== "authenticated") {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      // infers that `user` is non-nullable to downstream resolvers
      user: ctx.user,
    },
  });
});

//  Unprotected procedure
export const publicProcedure = t.procedure;
// Protected procedure
export const protectedProcedure = t.procedure.use(isAuthed);

// trpc.ts

// ... (previous code)


// Procedure to handle password reset
// export const forgotPasswordProcedure = t.procedure
//   .query.input.zod({ email: z.string() })
//   .mutation.shape(async ({ input }) => {
//     // Use Supabase Auth to send a password reset email
//     const { error } = await supabase.auth.api.resetPasswordForEmail(input.email);
    
//     if (error) {
//       throw new TRPCError({ code: "FORGOT_PASSWORD_ERROR", message: error.message });
//     }

//     return true;
//   });

