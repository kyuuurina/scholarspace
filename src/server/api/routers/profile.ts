import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const profileRouter = router({
  get: publicProcedure
    .input(z.object({ profile_id: z.string() }))
    .query(async ({ input, ctx }) => {
      const profile = await ctx.prisma.profile.findUnique({
        where: {
          profile_id: input.profile_id,
        },
      });

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Profile not found",
        });
      }

      return {
        ...profile,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        user_id: z.string(),
        name: z.string(),
        about_me: z.string().nullable(),
        skills: z.string().nullable(),
        research_interest: z.string().nullable(),
        collab_status: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const profile = await ctx.prisma.profile.create({
        data: {
          user_id: input.user_id,
          name: input.name,
          about_me: input.about_me,
          skills: input.skills,
          research_interest: input.research_interest,
          collab_status: input.collab_status,
        },
      });

      return profile;
    }),

  update: protectedProcedure
    .input(
      z.object({
        profile_id: z.string(),
        // user_id: z.string(),
        name: z.string(),
        about_me: z.string().nullable(),
        skills: z.string().nullable(),
        research_interest: z.string().nullable(),
        collab_status: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const profile = await ctx.prisma.profile.update({
        where: {
          profile_id: input.profile_id,
        },
        data: {
          name: input.name,
          about_me: input.about_me,
          skills: input.skills,
          research_interest: input.research_interest,
          collab_status: input.collab_status,
        },
      });

      return profile;
    }),
});


// import { z } from "zod";
// import { router, protectedProcedure } from "~/server/api/trpc";
// import { TRPCError } from "@trpc/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// const profileRouter = router({
//   validate: protectedProcedure.query(async ({ ctx }) => {
//     const userId = ctx.user?.id;

//     // check if this user has a profile
//     const profile = await ctx.prisma.profile.findFirst({
//       where: {
//         user_id: userId,
//       },
//     });

//     if (!profile) {
//       return false;
//     }

//     return true;
//   }),

//   updateProfile: protectedProcedure
//     .input(
//       z.object({
//         profile_id: z.string(),
//         name: z.string(),
//         avatar: z.string(),
//         about_me: z.string().nullable(),
//         skills: z.array(z.string()).nullable(),
//         research_interest: z.array(z.string()).nullable(),
//         collab_status: z.enum(['Open_For_Collaboration', 'Not_Open_For_Collaboration']),
//         // achievements: z.array(z.string()),
//         // education: z.array(z.string()),
//         // research_experience: z.array(z.string()).nullable(),
//       })
//     )
//     .mutation(async ({ input }) => {
//       const {
//         profile_id,
//         name,
//         avatar,
//         about_me,
//         skills,
//         research_interest,
//         collab_status,
//         // education,
//         // research_experience,
//         // achievements,
//       } = input;

//       try {
//         const profile = await prisma.profile.findUnique({
//           where: {
//             profile_id: profile_id,
//           },
//         });

//         if (!profile) {
//           throw new Error("Profile not found");
//         }

//         const updatedProfile = await prisma.profile.update({
//           where: {
//             profile_id: profile_id,
//           },
          
//           //profile table columns
//           data: {
//             name,
//             avatar,
//             about_me,
//             skills: skills ? { set: skills }: undefined, // Use Prisma set operation for arrays & accept nullable
//             research_interest: research_interest ? { set: research_interest } : undefined,

//             //education: education ? { set: education }: undefined,
//             //research_experience: research_experience ? { set: research_experience } : undefined,
//             //achievements: achievements ? { set: achievements }: undefined ,
//             //collab_status: collab_status ? { set: [collab_status] } : undefined as collab_status[],
//             //collab_status: collab_status ? { set: [collab_status] as any } : undefined,
//           },
//         });

//         return updatedProfile;
//       } catch (error: any) {
//         throw new Error(`Failed to update profile: ${error.message}`);
//       }
//     }),
// });

// export default profileRouter;
