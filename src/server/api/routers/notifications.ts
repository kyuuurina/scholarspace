import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { router, protectedProcedure } from "~/server/api/trpc";

export const notificationsRouter = router({
  // getNotification: protectedProcedure.query(async ({ ctx }) => {
  //   try {
  //     const notifications = await ctx.prisma.notification.findMany({
  //       where: {
  //         user_id: ctx.user.id,
  //       },
  //     });

  //     return notifications;
  //   } catch (err) {
  //     throw new TRPCError({
  //       code: "INTERNAL_SERVER_ERROR",
  //       message: "Internal server error",
  //     });
  //   }
  // }),

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

  createNotification: protectedProcedure
    .input(
      z.object({
        message: z.string(),
        type: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const notification = await ctx.prisma.notification.create({
        data: {
          ...input,
          user_id: ctx.user.id,
          notif_settings_id: ctx.user.id,
        },
      });

      return notification;
    }),
});
