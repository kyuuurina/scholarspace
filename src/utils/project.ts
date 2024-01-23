import { api } from "./api";
import type { phase, task } from "@prisma/client";

export type ProjectSummary = {
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
      name: string | null;
      phase_id: string;
    }[];
  }[];
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
        const mappedTasks = phaseTasks
          .map((task: task) => ({
            task_id: task.id,
            start_at: task.created_at,
            end_at: task.deadline,
            name: task.name,
            phase_id: task.phase_id,
          }))
          .sort((a, b) => a.start_at.getTime() - b.start_at.getTime());

        return {
          phase_id: phase.id,
          start_at: phase.start_at,
          end_at: phase.end_at,
          progress: phase.progress,
          name: phase.name,
          tasks: mappedTasks,
        };
      }),
    };
    projectSummary.phases.sort(
      (a, b) => a.start_at.getTime() - b.start_at.getTime()
    );
  }

  const refetch = async () => {
    await project.refetch();
    await phases.refetch();
    await tasks.refetch();
  };

  return { projectSummary, refetch };
};
