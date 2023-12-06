//note: import achievementrouter in root.ts
import { api } from "./api";
import { useRouterId } from "./routerId";

// Utility function to fetch achievement details for a specific ID
export const useFetchAchievement = () => {
  // Get achievement ID from the router
  const id: string = useRouterId();

  // Use TRPC query to fetch achievement details
  const achievement = api.achievement.getAchievements.useQuery(
    {
      achievement_id: id,
    },
    {
      enabled: !!id, // Only enable the query if ID is available
    }
  );

  // Destructure data, isLoading, and error from the achievement query result
  const {
    achievement_id,
    user_id,
    title,
    receieved_year,
    description,
  } = (achievement.data || {}) as {
        achievement_id: string;
        user_id: string;
        title: string;
        receieved_year: string | null;
        description: string | null;
  };


  // Destructure isLoading and error from the achievement query
  const { isLoading, error } = achievement;

  // Return the relevant information
  return {
    title,
    receieved_year,
    description,
    isLoading,
    error,
    achievement_id,
    user_id,
  };
};