// import { api } from "./api";
// import { useRouterId } from "./routerId";

// type User = {
//   profile_id: string;
//   name: string;
//   collab_status: string;
//   // Add more properties as needed
// };

// export const useFetchUser = (userId: string) => {
//   const user = api.user.getUser.useQuery(
//     {
//       user_id: userId,
//     },
//     {
//       enabled: !!userId,
//     }
//   );

//   const { profile_id, name, collab_status } = user.data || {};

//   const { isLoading, error } = user;

//   return {
//     user: { profile_id, name, collab_status },
//     isLoading,
//     error,
//   };
// };
