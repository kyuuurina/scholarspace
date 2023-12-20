//note: import educationrouter in root.ts
import { api } from "./api";
import { useRouterId } from "./routerId";

type Education = {
  education_id: string;
  user_id: string;
  school: string;
  start_year: string;
  end_year: string;
  description: string | null;
};

type EducationHookResult = {
  data: Education | null;
  isLoading: boolean;
  // error: any; // Update this to your actual error type
};

// Utility function to fetch education details for a specific ID
export const useFetchEducation = () => {
  // Get education ID from the router
  const id: string = useRouterId();
  
  // Use TRPC query to fetch education details
  const education = api.education.getEducations.useQuery(
    {
      education_id: id,
    },
    {
      enabled: !!id, // Only enable the query if ID is available
    }
  );

  // Destructure data, isLoading, and error from the education query result
  // const {
  //   education_id,
  //   user_id,
  //   school,
  //   start_year,
  //   end_year,
  //   description,
  // } = (education.data || {}) as {
  //       education_id: string;
  //       user_id: string;
  //       school: string;
  //       start_year: string;
  //       end_year: string;
  //       description: string | null;
  // };
  const {
    education_id,
    user_id,
    school,
    start_year,
    end_year,
    description,
  } = education.data || {};

  // Destructure isLoading and error from the education query
  const { data, isLoading, error } = education;

  // Return the relevant information
  // return {
  //   school,
  //   start_year,
  //   end_year,
  //   description,
  //   isLoading,
  //   error,
  //   education_id,
  //   user_id,
  // } as Education;

  return {
    data,
    isLoading,
    error,
  };
};

// Additional utility functions for creating, updating, and deleting education records
// ... (You can uncomment and modify these functions as needed)

// Note: Ensure that each utility function focuses on a specific task to maintain clarity and readability.

// Exported utility functions can be used in your components or other parts of the application.


// export const useFetchUserEducations = () => {
//   const userId: string = useRouterId();

//   const educations = api.education.listUserEducations.useQuery(
//     {
//       userId: userId,
//     },
//     {
//       enabled: !!userId,
//     }
//   );

//   const { data, isLoading, error } = educations;

//   return {
//     educations: data || [],
//     isLoading,
//     error,
//   };
// };

// export const useCreateEducation = () => {
//     const userId: string = useRouterId();
  
//     const createEducation = api.education.createEducation.useMutation();
  
//     const handleCreateEducation = async (educationData: {
//       school: string;
//       startYear: string;
//       endYear: string;
//       description: string | null;
//     }) => {
//       await createEducation.mutateAsync({
//         userId: userId,
//         ...educationData,
//       });
//     };
  
//     return {
//       createEducation: handleCreateEducation,
//     };
//   };
  
//   export const useUpdateEducation = () => {
//     const updateEducation = api.education.updateEducation.useMutation();
  
//     const handleUpdateEducation = async (
//       educationId: string,
//       educationData: {
//         school: string | null;
//         startYear: string | null;
//         endYear: string | null;
//         description: string | null;
//       }
//     ) => {
//       await updateEducation.mutateAsync({
//         educationId: educationId,
//         ...educationData,
//       });
//     };
  
//     return {
//       updateEducation: handleUpdateEducation,
//     };
//   };

// export const useDeleteEducation = () => {
//   const deleteEducation = api.education.deleteEducation.useMutation();

//   const handleDeleteEducation = async (educationId: string) => {
//     await deleteEducation.mutateAsync({
//       educationId: educationId,
//     });
//   };

//   return {
//     deleteEducation: handleDeleteEducation,
//   };
// };



// type Education = {
//   education_id: string;
//   school_name: string;
//   start_date: Date;
//   end_date: Date;
// };

// export const useFetchProfileEducation = () => {
//   const profileId: string = useRouterId();

//   const educationQuery = api.education.getProfileEducation.useQuery(
//     {
//       profile_id: profileId,
//     },
//     {
//       enabled: !!profileId,
//     }
//   );

//   const { isLoading, error, data } = educationQuery;

//   const profileEducation: Education[] = data || [];

//   return {
//     profileEducation,
//     isLoading,
//     error,
//   };
// };


