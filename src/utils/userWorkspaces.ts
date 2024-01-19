import { api } from "./api";
import { useRouterId } from "./routerId";

export const useGetWorkspaceRole = () => {
  const workspaceId = useRouterId();
  const workspaceRole = api.workspace.getWorkspaceRole.useQuery({
    workspaceId: workspaceId,
  });

  return workspaceRole.data;
};
