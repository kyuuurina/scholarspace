//note: import experiencerouter in root.ts
import { api } from "./api";
import { useRouterId } from "./routerId";


// Utility function to fetch experience details for a specific ID
export const useFetchExperience = () => {
  // Get experience ID from the router
  const id: string = useRouterId();

  // Use TRPC query to fetch experience details
  const experience = api.experience.getExperiences.useQuery(
    {
      experience_id: id,
    },
    {
      enabled: !!id, // Only enable the query if ID is available
    }
  );

  // Destructure data, isLoading, and error from the experience query result
  const {
    experience_id,
    user_id,
    title,
    start_year,
    end_year,
    description,
  } = (experience.data || {}) as {
        experience_id: string;
        user_id: string;
        title: string;
        start_year: string | null;
        end_year: string | null;
        description: string | null;
  };
  // const {
  //   experience_id,
  //   user_id,
  //   school,
  //   start_year,
  //   end_year,
  //   description,
  // } = experience.data || {};

  // Destructure isLoading and error from the experience query
  const { isLoading, error } = experience;

  // Return the relevant information
  return {
    title,
    start_year,
    end_year,
    description,
    isLoading,
    error,
    experience_id,
    user_id,
  };
};


