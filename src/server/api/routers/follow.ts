import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "~/server/api/trpc";

export const followRouter = router({
  toggleFollow: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input: { userId }, ctx }) => {
      // const currentUserId = ctx.session?.user.id;
      const {user} = ctx;

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const existingFollow = await ctx.prisma.follow.findUnique({
        where: {
          follower_id_following_id: {
            // follower_id: currentUserId,
            follower_id: user.id,
            following_id: userId,
          },
        },
      });

      if (!existingFollow) {
        await ctx.prisma.follow.create({
          data: {
            follower_id: user.id,
            following_id: userId,
          },
        });
        return { isFollowing: true };
      } else {
        await ctx.prisma.follow.delete({
          where: {
            follower_id_following_id: {
              follower_id: user.id,
              following_id: userId,
            },
          },
        });
        return { isFollowing: false };
      }
    }),
});




// import { z } from "zod";
// import { TRPCError } from "@trpc/server";
// import { router, protectedProcedure } from "~/server/api/trpc";

// export const followRouter = router({
//   follow: protectedProcedure
//     .input(
//       z.object({
//         targetUserId: z.string(),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {
//       const { prisma, user } = ctx;

//       const targetUser = await prisma.user.findUnique({
//         where: { id: input.targetUserId },
//       });

//       if (!targetUser) {
//         throw new TRPCError({
//           code: "NOT_FOUND",
//           message: "Target user not found",
//         });
//       }

//       // Create the follow relationship
//       await prisma.follow.create({
//         data: {
//           follower_id: user.id,
//           following_id: input.targetUserId,
//         },
//       });

//       return true;
//     }),

//   unfollow: protectedProcedure
//     .input(
//       z.object({
//         targetUserId: z.string(),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {
//       const { prisma, user } = ctx;

//       const targetUser = await prisma.user.findUnique({
//         where: { id: input.targetUserId },
//       });

//       if (!targetUser) {
//         throw new TRPCError({
//           code: "NOT_FOUND",
//           message: "Target user not found",
//         });
//       }

//       // Delete the follow relationship
//       await prisma.follow.deleteMany({
//         where: {
//           follower_id: user.id,
//           following_id: input.targetUserId,
//         },
//       });

//       return true;
//     }),
// });
