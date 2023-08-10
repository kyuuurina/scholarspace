import { api } from "./api";

export const fetchUserWorkspaces = () => {
  const workspaces = api.workspace.listUserWorkspaces.useQuery();
  const workspacesData = workspaces.data;

  const workspaceListings: { id: string; name: string | null }[] =
    workspacesData
      ? workspacesData.map((w) => ({
          id: w.workspace.id,
          name: w.workspace.name,
        }))
      : [];

  return { workspacesData, workspaceListings };
};
