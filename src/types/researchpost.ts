//This type is the form data of a research post. This type is used in the ResearchPostForm component for CRUD operations.

type ResearchPostFormData = {
    category: string;
    title: string;
    description: string;
    author: string;
    document : string | null;
  };
  
  export type { ResearchPostFormData };