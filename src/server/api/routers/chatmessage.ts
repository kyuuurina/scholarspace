import { z } from "zod";
import { router, protectedProcedure } from "~/server/api/trpc";
import { REALTIME_SUBSCRIBE_STATES } from "@supabase/realtime-js";

export const chatRouter = router({
  // Procedure to get or create a chat for a given pair of users
  getOrCreateChat: protectedProcedure
    .input(z.object({ user2_id: z.string() }))
    .query(async ({ input, ctx }) => {
      const { user2_id } = input;
      const user1_id = ctx.user?.id;

      // Check if a chat already exists for the given pair of users
      let chat = await ctx.prisma.chat.findFirst({
        where: {
          OR: [
            {
              user1_id,
              user2_id,
            },
            {
              user1_id: user2_id,
              user2_id: user1_id,
            }, // Check both directions
          ],
        },
      });

      // If no chat exists, create a new one
      if (!chat) {
        chat = await ctx.prisma.chat.create({
          data: {
            user1_id,
            user2_id,
          },
        });
      }

      return chat;
    }),

  // Procedure to get messages for a specific chat
  getChatMessages: protectedProcedure
    .input(z.object({ chat_id: z.number() }))
    .query(async ({ input, ctx }) => {
      const { chat_id } = input;

      // Fetch messages for the specified chat_id
      const messages = await ctx.prisma.message.findMany({
        where: { chat_id },
        orderBy: { timestamp: "asc" }, // Order messages by timestamp
      });

      return messages;
    }),

  // Procedure to send a message in a chat
  sendMessage: protectedProcedure
  .input(
    z.object({
      chat_id: z.number(),
      content: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { chat_id, content } = input;
    const sender_id = ctx.user?.id;

    // Ensure ctx has the supabaseRealtime property
    if (!('supabaseRealtime' in ctx)) {
      throw new Error('supabaseRealtime is not available in the context');
    }

    // Create a new message in the specified chat
    const message = await ctx.prisma.message.create({
      data: {
        chat_id,
        sender_id,
        content,
      },
    });

    // Notify subscribers about the new message using Supabase Realtime
    ctx.supabaseRealtime.publish(`chat:${chat_id}`, { event: "new_message", payload: message });

    return message;
  }),
});