import { api } from "./api";
import { useRouterId } from "./routerId";
import { phase, task } from "@prisma/client";

type Member = {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    avatar_url: string | null;
  };
  project_role: string | null;
  is_external_collaborator: boolean;
};

type Project = {
  project_id: string;
  name: string;
  description: string;
  cover_img: string | null;
  c_score: number;
  p_score: number; // Make it nullable to handle potential null values
};

// type ProjectSummary = {
//   project_id: string; // Assuming a project has an ID
//   phases: {
//     phase_id: string;
//     tasks: {
//       task_id: string;
//       start_at: Date;
//       end_at: Date | null;
//       progress: number;
//       name: string | null;
//     }[];
//     start_at: Date;
//     end_at: Date | null;
//     progress: number;
//     name: string | null;
//   }[];
// };

type ProjectSummary = {
  project_name: string; // Assuming a project has an ID
  phases: {
    phase_id: string;
    start_at: Date;
    end_at: Date | null;
    progress: number;
    name: string | null;
    tasks: {
      task_id: string;
      start_at: Date;
      end_at: Date | null;
      progress: number;
      name: string | null;
      phase_id: string;
    }[];
  }[];
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

  const {
    name,
    description,
    cover_img,
    c_score,
    p_score,
    users,
    workspace_id,
  } = project.data || {};

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
    workspace_id,
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

export const useFecthProjectRole = () => {
  const id: string = useRouterId();

  const projectRole = api.project.getProjectUserRole.useQuery(
    {
      project_id: id,
    },
    {
      enabled: !!id,
    }
  );

  const { isLoading, error, data } = projectRole;

  return {
    project_role: data?.project_role,
    is_external_collaborator: data?.is_external_collaborator,
    isLoading,
    error,
  };
};

export const useFetchProjectMembers = () => {
  const id: string = useRouterId();

  const members = api.project.getProjectMembers.useQuery(
    {
      id,
    },
    {
      enabled: !!id,
    }
  );

  const { isLoading, error } = members;

  // push member data into array
  const projectMembers: {
    memberId: string;
    memberName: string | null;
    memberEmail: string | null;
    memberRole: string | null;
    memberAvatarUrl: string | null; // Make it nullable to handle potential null values
    memberIsExternalCollaborator?: boolean;
  }[] = [];
  const userDropdown: any[] = [];

  if (members.data) {
    members.data.forEach((member: Member) => {
      projectMembers.push({
        memberId: member.user?.id,
        memberName: member.user?.name,
        memberEmail: member.user.email,
        memberRole: member.project_role,
        memberAvatarUrl: member.user.avatar_url,
        memberIsExternalCollaborator: member.is_external_collaborator,
      });
      userDropdown.push({
        value: member.user?.id,
        label: member.user.email || "",
      });
    });
  }

  return {
    projectMembers,
    userDropdown,
    error,
    isLoading,
  };
};

export const useFetchProjectSummary = (project_id: string) => {
  let projectSummary: ProjectSummary = {
    project_name: "",
    phases: [],
  };

  // fetch a project first
  const project = api.project.get.useQuery(
    {
      project_id,
    },
    {
      enabled: !!project_id,
    }
  );

  // fetch the phases of the project
  const phases = api.phase.list.useQuery(
    {
      project_id,
    },
    {
      enabled: !!project_id,
    }
  );

  // fetch the tasks of the project
  const tasks = api.task.listByProject.useQuery(
    {
      project_id,
    },
    {
      enabled: !!project_id,
    }
  );

  if (project.data && phases.data && tasks.data) {
    projectSummary = {
      project_name: project.data.name,
      phases: phases.data.map((phase: phase) => {
        // Filter tasks for the current phase
        const phaseTasks = tasks.data.filter(
          (task: task) => task.phase_id === phase.id
        );

        // Map tasks to the desired structure
        const mappedTasks = phaseTasks.map((task: task) => ({
          task_id: task.id,
          start_at: task.created_at,
          end_at: task.end_at,
          progress: 0,
          name: task.name,
          phase_id: task.phase_id,
        }));

        return {
          phase_id: phase.id,
          start_at: phase.start_at,
          end_at: phase.end_at,
          progress: 0,
          name: phase.name,
          tasks: mappedTasks,
        };
      }),
    };
  }

  return projectSummary;
};
