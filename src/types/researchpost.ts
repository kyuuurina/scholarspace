//This type is the form data of a research post. 
//This type is used in the ResearchPostForm component for CRUD operations.
//Below are all data input by user in the form

type ResearchPostFormData = {
    category: string;
    title: string;
    description: string | null;
    author: string;
    document : string | null;
  };
  
  export type { ResearchPostFormData };