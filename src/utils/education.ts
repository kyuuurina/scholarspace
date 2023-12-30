import { api } from "./api";
import { useRouterId } from "./routerId";

// export const useFetchEducation = () => {
//   const id: string = useRouterId();

//   const education = api.education.getEducations.useQuery(
//     {
//       profile_id: id,
//     },
//     {
//       enabled: !!id,
//     }
//   );

//   const { data, isLoading, error } = education;

//   // Ensure data is not null before destructure
//   const {
//     education_id,
//     school,
//     start_year,
//     end_year,
//     description,
//     profile_id,
//     user_id,
//   } = data?.[0] || {
//     education_id: "",
//     school: "",
//     start_year: "",
//     end_year: "",
//     description: "",
//     profile_id: "",
//     user_id: "",
//   };

//   return {
//     education_id,
//     school,
//     start_year,
//     end_year,
//     description,
//     profile_id,
//     user_id,
//     isLoading,
//     error,
//   };
// };

export const useFetchEducation = () => {
  const id: string = useRouterId();

  const educationQuery = api.education.getEducations.useQuery(
    {
      profile_id: id,
    },
    {
      enabled: !!id,
    }
  );

  const { data: educations, isLoading, error } = educationQuery;

  // Ensure data is not null before destructure
  const [firstEducation] = educations || [];

  const {
    education_id,
    school,
    start_year,
    end_year,
    description,
    profile_id,
    user_id,
  } = firstEducation || {
    education_id: "",
    school: "",
    start_year: "",
    end_year: "",
    description: "",
    profile_id: "",
    user_id: "",
  };

  return {
    educations,
    education_id,
    school,
    start_year,
    end_year,
    description,
    profile_id,
    user_id,
    isLoading,
    error,
  };
};

// import { api } from "./api";
// import { useRouterId } from "./routerId";

// type Education = {
//   education_id: string;
//   user_id: string;
//   school: string;
//   start_year: string;
//   end_year: string;
//   description: string | null;
// };

// type EducationHookResult = {
//   data: Education | null;
//   isLoading: boolean;
//   // error: any; // Update this to your actual error type
// };

// // Utility function to fetch education details for a specific ID
// export const useFetchEducation = () => {
//   // Get education ID from the router
//   const id: string = useRouterId();
  
//   // Use TRPC query to fetch education details
//   const education = api.education.getEducations.useQuery(
//     {
//       education_id: id,
//     },
//     {
//       enabled: !!id, // Only enable the query if ID is available
//     }
//   );

//   // Destructure data, isLoading, and error from the education query result
//   // const {
//   //   education_id,
//   //   user_id,
//   //   school,
//   //   start_year,
//   //   end_year,
//   //   description,
//   // } = (education.data || {}) as {
//   //       education_id: string;
//   //       user_id: string;
//   //       school: string;
//   //       start_year: string;
//   //       end_year: string;
//   //       description: string | null;
//   // };
//   const {
//     education_id,
//     user_id,
//     school,
//     start_year,
//     end_year,
//     description,
//   } = education.data || {};

//   // Destructure isLoading and error from the education query
//   const { data, isLoading, error } = education;

//   // Return the relevant information
//   // return {
//   //   school,
//   //   start_year,
//   //   end_year,
//   //   description,
//   //   isLoading,
//   //   error,
//   //   education_id,
//   //   user_id,
//   // } as Education;

//   return {
//     data,
//     isLoading,
//     error,
//   };
// };