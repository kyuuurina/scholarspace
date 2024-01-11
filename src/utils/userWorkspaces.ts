import { api } from "./api";
import { useRouterId } from "./routerId";

export const fetchUserWorkspaces = () => {
  const {
    data: workspaces,
    isLoading,
    refetch,
  } = api.workspace.listUserWorkspaces.useQuery();
  const workspacesData = workspaces;

  const workspaceListings: {
    id: string;
    name: string;
    cover_img: string | null;
  }[] = workspacesData
    ? workspacesData.map((w) => ({
        id: w.workspace.id,
        name: w.workspace.name,
        cover_img: w.workspace.cover_img,
      }))
    : [];

  return { workspacesData, workspaceListings, isLoading, refetch };
};

export const useGetWorkspaceRole = () => {
  const workspaceId = useRouterId();
  const workspaceRole = api.workspace.getWorkspaceRole.useQuery({
    workspaceId: workspaceId,
  });

  return workspaceRole.data;
};
