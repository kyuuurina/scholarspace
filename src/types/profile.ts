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
    profile_id: string;
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

