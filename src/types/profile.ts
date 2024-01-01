//user input in UserProfileForm.tsx, ProfileEducationForm.tsx, ProfileAchievementForm.tsx, ProfileExperienceForm.tsx

type ProfileFormData = {
    avatar_url: string | null;
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

  type FormData = {
    name: string;
    avatar_url: string | null;
    about_me: string | null;
    research_interest: string | null;
    collab_status: "Open_For_Collaboration" | "Not_Open_For_Collaboration";
    skills: string | null;
  };

  export type { ProfileFormData, AchievementFormData, EducationFormData, ExperienceFormData, FormData };

