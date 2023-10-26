//This type is the form data of a research post. This type is used in the ResearchPostForm component for CRUD operations.

type ResearchPostFormData = {
    title: string;
    research_type: string;
    description: string;
    author: string | null;
    document : File | null;
  };
  
  export type { ResearchPostFormData };