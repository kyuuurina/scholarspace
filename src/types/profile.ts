//user input in UserProfileForm.tsx

type ProfileFormData = {
    name: string;
    about_me: string | null;
    skills: string[] | null;
    achievements: string[] | null;
    education: string[] | null;
    research_experience: string[] | null;
    collab_status: 'Open_For_Collaboration' | 'Not_Open_For_Collaboration' | null;  //enum values
  };
  
  export type { ProfileFormData };
  