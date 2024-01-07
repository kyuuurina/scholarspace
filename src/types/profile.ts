//user input in ProfileForm.tsx

type ProfileFormData = {
  name: string;
  about_me: string | null;
  skills: string[] | null;
  achievements: string[] | null;
  education: string[] | null;
  research_experience: string[] | null;
  collab_status: "Open_For_Collaboration" | "Not_Open_For_Collaboration" | null; //enum values
};

type FormData = {
  name: string;
  avatar_url: string | null;
  about_me: string | null;
  research_interest: string | null;
  collab_status: string | null;
  skills: string | null;
};

export type { ProfileFormData, FormData };
