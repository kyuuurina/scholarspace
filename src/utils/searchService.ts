//function to query name of a profile

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const search = async (query: string) => {
  const results = await prisma.profile.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
  });

  return results;
};


// import { api } from "./api";
// import { useRouterId } from "./routerId";
// import { PrismaClient } from "@prisma/client";


// const prisma = new PrismaClient();

// export const search = async (query: string) => {
//   const results = await prisma.research_post.findMany({
//     where: {
//       OR: [
//         {
//           title: {
//             contains: query,
//             mode: "insensitive",
//           },
//         },
//         {
//           profile: {
//             name: {
//               contains: query,
//               mode: "insensitive",
//             },
//           },
//         },
//       ],
//     },
//   });

//   return results;
// };


