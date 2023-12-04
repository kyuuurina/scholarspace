//user input in UserProfileForm.tsx, ProfileEducationForm.tsx, ProfileAchievementForm.tsx, ProfileExperienceForm.tsx

type ProfileFormData = {
    name: string;
    about_me: string | null;
    skills: string | null;
    research_interest: string | null;
    collab_status: string | null;
  };

  type AchievementFormData = {
    title: string;
    received_year: string;
    description: string | null;
  };

  type EducationFormData = {
    school: string;
    description: string | null;
    start_year: string;
    end_year: string;
  };

  type ExperienceFormData = {
    title: string;
    description: string | null;
    start_year: string;
    end_year: string;
  };

  export type { ProfileFormData, AchievementFormData, EducationFormData, ExperienceFormData };


// type Profile = {
//   profile_id: string;
//   user_id: string;
//   name: string;
//   avatar?: string;
//   about_me?: string;
//   research_interest?: string[];
//   collab_status?: "Open_For_Collaboration" | "Not_Open_for_Collaboration";
//   skills?: string[];
//   profile_education?: ProfileEducation[];
// };

// type ProfileEducation = {
//   education_id: string;
//   school_name?: string;
//   start_date?: string;
//   end_date?: string;
// };

// type ProfileFormData = {
//   name: string;
//   about_me?: string | null;
//   skills?: string[] | null;
//   research_interest?: string[] | null;
//   collab_status?: "Open_For_Collaboration" | "Not_Open_for_Collaboration";
//   //education?: ProfileEducationFormData[];
// };

// type ProfileEducationFormData = {
//   school_name?: string;
//   start_date?: string;
//   end_date?: string;
// };


// type ProfileAchievementFormData = {
//   achievement_name?: string;
//   achievement_date?: string;
// };

// type ProfileExperienceFormData ={
//   title: string;
//   start_date: string;
//   end_date: string;
// };

// export type { ProfileFormData, ProfileEducationFormData, ProfileExperienceFormData, ProfileAchievementFormData };



// type ProfileFormData = {
//     name: string;
//     about_me: string | null;
//     skills: string[] | null;
//     research_interest: string[] | null;
//     collab_status: 'Open_For_Collaboration' | 'Not_Open_For_Collaboration' | null;  //enum values
//     // achievements: string[] | null;
//     // education: string[] | null;
//     // research_experience: string[] | null;
//   };
//   export type { ProfileFormData };