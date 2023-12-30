//note: import achievementrouter in root.ts
import { api } from "./api";
import { useRouterId } from "./routerId";

export const useFetchAchievement= () => {
  const id: string = useRouterId();

  const achievementQuery = api.achievement.getAchievements.useQuery(
    {
      profile_id: id,
    },
    {
      enabled: !!id,
    }
  );

  const { data: achievements, isLoading, error } = achievementQuery;

  // Ensure data is not null before destructure
  const [firstAchievement] = achievements || [];

  const {
    achievement_id,
    title,
    received_year,
    description,
    profile_id,
    user_id,
  } = firstAchievement || {
    achievement_id: "",
    title: "",
    received_year: "",
    description: "",
    profile_id: "",
    user_id: "",
  };

  return {
    achievements,
    achievement_id,
    title,
    received_year,
    description,
    profile_id,
    user_id,
    isLoading,
    error,
  };
};


// export const useFetchAchievement = () => {
//   const id: string = useRouterId();

//   // Use TRPC query to fetch achievement details
//   const achievement = api.achievement.get.useQuery(
//     {
//       profile_id: id,
//     },
//     {
//       enabled: !!id, // Only enable the query if ID is available
//     }
//   );

//   // Destructure data, isLoading, and error from the achievement query result
//   const {
//     achievement_id,
//     user_id,
//     title,
//     receieved_year,
//     description,
//   } = (achievement.data || {}) as {
//         achievement_id: string;
//         user_id: string;
//         title: string;
//         receieved_year: string | null;
//         description: string | null;
//   };


//   // Destructure isLoading and error from the achievement query
//   const { isLoading, error } = achievement;

//   // Return the relevant information
//   return {
//     title,
//     receieved_year,
//     description,
//     isLoading,
//     error,
//     achievement_id,
//     user_id,
//   };
// };