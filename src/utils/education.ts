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

