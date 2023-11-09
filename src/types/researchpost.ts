//Define data type of ResearchPostForm component
//Below are all data input by user in the form

type ResearchPostFormData = {
    category: string;
    title: string;
    description: string | null;
    author: string;
    document : string | null;
  };
  
  export type { ResearchPostFormData };