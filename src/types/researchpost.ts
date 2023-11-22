//Define data type of ResearchPostForm component
//Below are all data input by user in the form


//must match with enum values with schema.prisma
enum Category {
  Article = 'Article',
  ConferencePaper = 'Conference Paper',
  Presentation = 'Presentation',
  Preprint = 'Preprint',
  ResearchProposal = 'Research Proposal',
  Thesis = 'Thesis',
  Others = 'Others',
}

type ResearchPostFormData = {
    category: string;
    title: string;
    description: string | null;
    author: string;
    document : string | null;
  };
  
  export type { ResearchPostFormData };