import { api } from "./api";
import { useRouterId } from "./routerId";


export const useResearchPost = () => {
  const id: string = useRouterId();

  const researchpost = api.researchpost.get.useQuery(
    {
      id: id,
    },
    {
      enabled: !!id,
    }
  );

  const {  category, title, description, author,  document } =
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
};


  return {
    error,
    isLoading,
  };
};
