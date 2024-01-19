import { api } from "./api";
import { useRouterId } from "./routerId";

type Member = {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    avatar_url: string | null;
  };
  workspace_role: string | null;
};

export const useFetchWorkspace = () => {
  const id: string = useRouterId();

  const workspace = api.workspace.get.useQuery(
    {
      id: id,
    },
    {
      enabled: !!id,
    }
  );

  const { name, description, cover_img, is_personal, ownerid } =
    workspace.data || {};

  const { isLoading, error } = workspace;

  let imgUrl = "";
  if (cover_img) {
    imgUrl = `https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/workspace-covers/${cover_img}`;
  }

  return {
    name,
    description,
    cover_img,
    isLoading,
    error,
    is_personal,
    imgUrl,
    ownerid,
  };
};

