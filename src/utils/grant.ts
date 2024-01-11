import { api } from "./api";
import type { grant, project } from "@prisma/client";

export type GrantSummary = {
  workspace_id: string;
  grants: {
    name: string;
    progress: number;
    id: string;
    start_at: Date;
    end_at: Date | null;
    projects: {
      name: string;
      progress: number;
      id: string;
      start_at: Date;
      end_at: Date | null;
    }[];
  }[];
};

export const useFetchGrantSummary = (workspace_id: string) => {
  let grantSummary: GrantSummary = {
    workspace_id: "",
    grants: [],
  };

  // fetch grants
  const grants = api.grant.listByWorkspace.useQuery(
    {
      workspace_id,
    },
    {
      enabled: !!workspace_id,
    }
  );

  // fetch projects of workspace
  const projects = api.project.getWorkspaceProjects.useQuery(
    {
      workspace_id,
    },
    {
      enabled: !!workspace_id,
    }
  );

  if (grants.data && projects.data) {
    // Populate grantSummary with data from grants
    grantSummary = {
      workspace_id: workspace_id,
      grants: grants.data
        .map((grant: grant) => {
          // Filter tasks for the current phase
          const grantProjects = projects.data.filter(
            (project: project) => project.grant_id === grant.id
          );

          // Map tasks to the desired structure
          const mappedProjects = grantProjects
            .map((project: project) => ({
              id: project.project_id,
              start_at: project.start_at,
              end_at: project.end_at,
              name: project.name,
              progress: project.progress,
            }))
            .sort((a, b) => a.start_at.getTime() - b.start_at.getTime());

          return {
            id: grant.id,
            start_at: grant.start_at,
            end_at: grant.end_at,
            name: grant.name,
            progress: grant.progress,
            projects: mappedProjects,
          };
        })
        .sort((a, b) => a.start_at.getTime() - b.start_at.getTime()),
    };
  }

  const refetch = async () => {
    await grants.refetch();
    await projects.refetch();
  };

  return { grantSummary, refetch };
};
