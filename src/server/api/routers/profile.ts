import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

// Define the profile router
export const profileRouter = router({
  // Procedure to get a user's profile
  get: protectedProcedure
    .input(z.object({ profile_id: z.string() }))
    .query(async ({ input, ctx }) => {
      // Find the profile in the database based on the provided profile_id
      const profile = await ctx.prisma.profile.findUnique({
        where: {
          profile_id: input.profile_id,
        },
      });

      // If the profile is not found, throw a NOT_FOUND error
      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Profile not found",
        });
      }

      // Return the profile if found
      return {
        ...profile,
      };
    }),

  // Procedure to update a user's profile
  updateProfile: protectedProcedure
    .input(
      // Define the input schema for the updateProfile mutation
      z.object({
        profile_id: z.string(),
        name: z.string(),
        about_me: z.string().nullable(),
        skills: z.string().nullable(),
        research_interest: z.string().nullable(),
        collab_status: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Destructure input to get relevant properties
      const { profile_id, name, about_me, skills, research_interest, collab_status } = input;

      // Find the profile in the database based on the provided profile_id
      const profile = await ctx.prisma.profile.findUnique({
        where: {
          profile_id,
        },
      });

      // If the profile doesn't exist or the user is not the owner, throw an error
      if (!profile || profile.user_id !== ctx.user.id) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update this profile.",
        });
      }

      // Update the profile in the database with the provided data
      const updatedProfile = await ctx.prisma.profile.update({
        where: {
          profile_id,
        },
        data: {
          name,
          about_me,
          skills,
          research_interest,
          collab_status,
        },
      });

      // Return the updated profile
      return updatedProfile;
    }),
});

// export const profileRouter = router({
//   get: publicProcedure
//     .input(z.object({ profile_id: z.string() }))
//     .query(async ({ input, ctx }) => {
//       const profile = await ctx.prisma.profile.findUnique({
//         where: {
//           profile_id: input.profile_id,
//         },
//       });

//       if (!profile) {
//         throw new TRPCError({
//           code: "NOT_FOUND",
//           message: "Profile not found",
//         });
//       }

//       return {
//         ...profile,
//       };
//     }),

//   createProfile: protectedProcedure
//     .input(
//       z.object({
//         name: z.string(),
//         about_me: z.string().nullable(),
//         skills: z.string().nullable(),
//         research_interest: z.string().nullable(),
//         collab_status: z.string().nullable(),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {
//       const newProfile = await ctx.prisma.profile.create({
//         data: {
//           user_id: ctx.user.id,
//           ...input,
//         },
//       });

//       return newProfile;
//     }),

//     updateProfile: protectedProcedure
//     .input(
//       z.object({
//         profile_id: z.string(),
//         name: z.string(),
//         about_me: z.string().nullable(),
//         skills: z.string().nullable(),
//         research_interest: z.string().nullable(),
//         collab_status: z.string().nullable(),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {
//       const { profile_id, name, about_me, skills, research_interest, collab_status} = input;

//       const profile = await ctx.prisma.profile.findUnique({
//         where: {
//           profile_id,
//         },
//       });

//       if (!profile || profile.user_id !== ctx.user.id) {
//         throw new TRPCError({
//           code: "INTERNAL_SERVER_ERROR",
//           message: "Failed to update this profile.",
//         });
//       }

//       const updatedProfile = await ctx.prisma.profile.update({
//         where: {
//           profile_id,
//         },
//         data: {
//           name,
//           about_me,
//           skills,
//           research_interest,
//           collab_status,
//         },
//       });

//       return updatedProfile;
//     }),

//   //delete experience procedure
//   deleteProfile: protectedProcedure
//     .input(z.object({ profile_id: z.string() }))
//     .mutation(async ({ input, ctx }) => {
//       const { profile_id } = input;

//       const profile = await ctx.prisma.profile.findUnique({
//         where: {
//           profile_id,
//         },
//       });

//       if (!profile || profile.user_id !== ctx.user.id) {
//         throw new TRPCError({
//           code: "INTERNAL_SERVER_ERROR",
//           message: "Failed to delete this profile.",
//         });
//       }

//       await ctx.prisma.profile.delete({
//         where: {
//           profile_id,
//         },
//       });

//       return { success: true };
//     }),
// });

//new

// export const profileRouter = router({
//   get: publicProcedure
//     .input(z.object({ profile_id: z.string() }))
//     .query(async ({ input, ctx }) => {
//       const profile = await ctx.prisma.profile.findUnique({
//         where: {
//           profile_id: input.profile_id,
//         },
//       });

//       if (!profile) {
//         throw new TRPCError({
//           code: "NOT_FOUND",
//           message: "Profile not found",
//         });
//       }

//       return {
//         ...profile,
//       };
//     }),

//   create: protectedProcedure
//     .input(
//       z.object({
//         user_id: z.string(),
//         name: z.string(),
//         about_me: z.string().nullable(),
//         skills: z.string().nullable(),
//         research_interest: z.string().nullable(),
//         collab_status: z.string().nullable(),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {
//       const profile = await ctx.prisma.profile.create({
//         data: {
//           user_id: input.user_id,
//           name: input.name,
//           about_me: input.about_me,
//           skills: input.skills,
//           research_interest: input.research_interest,
//           collab_status: input.collab_status,
//         },
//       });

//       return profile;
//     }),

//   update: protectedProcedure
//     .input(
//       z.object({
//         profile_id: z.string(),
//         // user_id: z.string(),
//         name: z.string(),
//         about_me: z.string().nullable(),
//         skills: z.string().nullable(),
//         research_interest: z.string().nullable(),
//         collab_status: z.string().nullable(),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {
//       const profile = await ctx.prisma.profile.update({
//         where: {
//           profile_id: input.profile_id,
//         },
//         data: {
//           name: input.name,
//           about_me: input.about_me,
//           skills: input.skills,
//           research_interest: input.research_interest,
//           collab_status: input.collab_status,
//         },
//       });

//       return profile;
//     }),
// });


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
