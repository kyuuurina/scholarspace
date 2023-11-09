import { api } from "./api";
import { useRouterId } from "./routerId";

type Project = {
  project_id: string;
  name: string;
  description: string;
  cover_img: string | null;
  c_score: number;
  p_score: number; // Make it nullable to handle potential null values
};

export const useFetchProject = () => {
  const id: string = useRouterId();

  const project = api.project.get.useQuery(
    {
      project_id: id,
    },
    {
      enabled: !!id,
    }
  );

  const { name, description, cover_img, c_score, p_score, users } =
    project.data || {};

  let imgUrl = "";
  if (cover_img) {
    imgUrl = `https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/project-covers/${cover_img}`;
  }

  const { isLoading, error } = project;

  return {
    name,
    description,
    imgUrl,
    c_score,
    p_score,
    users,
    isLoading,
    error,
    cover_img,
  };
};

export const useFetchWorkspaceProjects = () => {
  const id: string = useRouterId();

  const projects = api.project.getWorkspaceProjects.useQuery(
    {
      workspace_id: id,
    },
    {
      enabled: !!id,
    }
  );

  // returns an array of projects, push project data into array
  const workspaceProjects: {
    project_id: string;
    name: string;
    description: string;
    cover_img: string | null;
    c_score: number;
    p_score: number; // Make it nullable to handle potential null values
  }[] = [];
  if (projects.data) {
    projects.data.forEach((project: Project) => {
      workspaceProjects.push({
        project_id: project.project_id,
        name: project.name,
        description: project.description,
        cover_img: project.cover_img,
        c_score: project.c_score,
        p_score: project.p_score,
      });
    });
  }
  return workspaceProjects;
};
