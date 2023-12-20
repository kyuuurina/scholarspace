import { api } from "./api";
import { useRouterId } from "./routerId";

type Education = {
  education_id: string;
//   user_id: string;
  school: string;
  start_year: string;
  end_year: string;
  description: string | null;
};

export const useFetchTry = () => {
    const id: string = useRouterId();
  
    const myEducations = api.education.getEducations.useQuery(
      {
        education_id: id,
      },
      {
        enabled: !!id, // Only enable the query if ID is available
      }
    );
  
    const { data, isLoading, error } = myEducations;
  
    // Ensure data is an array or provide a default empty array
    const educationsArray = Array.isArray(data) ? data : [];
  
    return {
      myEducations: educationsArray,
      isLoading,
      error,
    };
  };
  

// export const useFetchTry = () => {
//   const id: string = useRouterId();
  
//   const myEducations = api.education.getEducations.useQuery(
//     {
//       education_id: id,
//     },
//     {
//       enabled: !!id, // Only enable the query if ID is available
//     }
//   );

//     const { data, isLoading, error } = myEducations;

//     return {
//       myEducations: data || [],
//       isLoading,
//       error,
//     };

// };