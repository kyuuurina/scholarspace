import { api } from "./api";
import { useRouterId } from "./routerId";
import { postRouter } from "~/server/api/routers/researchpost";

type ResearchPost = {
  category: string;
  title: string;
  author: string;
  description: string | null;
  document: string | null;
};

export const useCreateResearchPost = () => {
  const id: string = useRouterId();

  const researchpost = api.researchpost.get.useQuery(
    {
      post_id: id,
    },
    {
      enabled: !!id,
    }
  );

  const {  category, title, author, description, document } =
    researchpost.data || {};

  const { isLoading, error } = researchpost;

  let imgUrl = "";
  if (document) {
    imgUrl = `https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/post-files-upload/${document}`;
  }

  return {
    category,
    title,
    author,
    description,
    document,
    isLoading,
    error,
    imgUrl,
  };

  return {
    error,
    isLoading,
  };
};
  
};




