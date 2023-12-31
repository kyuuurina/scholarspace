//Define data type of ResearchPostForm component
//Below are all data input by user in the form

type ResearchPostFormData = {
    category: string;
    title: string;
    description: string | null;
    author: string | null;
    document : string | null;
    // user_id: string;
    // created_at: Date;
  };
  
  export type { ResearchPostFormData };