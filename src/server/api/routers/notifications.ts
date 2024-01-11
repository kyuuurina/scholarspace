import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { router, protectedProcedure } from "~/server/api/trpc";

export const notificationsRouter = router({
  getSettings: protectedProcedure.query(async ({ ctx }) => {
    try {
      const notificationSettings =
        await ctx.prisma.notification_settings.findUnique({
          where: {
            user_id: ctx.user.id,
          },
        });

      return notificationSettings;
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
      });
    }
  }),

  updateWebEnbld: protectedProcedure
    .input(
      z.object({
        web_enbld: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const notificationSettings =
          await ctx.prisma.notification_settings.update({
            where: {
              user_id: ctx.user.id,
            },
            data: {
              web_enbld: input.web_enbld,
            },
          });

        return notificationSettings;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
        });
      }
    }),

  updateEmailEnbld: protectedProcedure
    .input(
      z.object({
        email_enbld: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const notificationSettings =
          await ctx.prisma.notification_settings.update({
            where: {
              user_id: ctx.user.id,
            },
            data: {
              email_enbld: input.email_enbld,
            },
          });

        return notificationSettings;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
        });
      }
    }),

  updateTaskReminder: protectedProcedure
    .input(
      z.object({
        task_rmndr_enbld: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const notificationSettings =
          await ctx.prisma.notification_settings.update({
            where: {
              user_id: ctx.user.id,
            },
            data: {
              task_rmndr_enbld: input.task_rmndr_enbld,
            },
          });

        return notificationSettings;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
        });
      }
    }),
});
