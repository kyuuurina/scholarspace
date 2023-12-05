import { api } from "./api";
import type { task } from "@prisma/client";

export const useFetchTasks = (phase_id: string) => {
  const tasksQuery = api.task.list.useQuery(
    {
      phase_id,
    },
    {
      enabled: !!phase_id,
    }
  );

  // returns an array of projects, push project data into array
  const tasks: {
    id: string;
    name: string;
    description: string | null;
    created_at: Date;
    status: string;
    assignees: string | null;
    phase_id: string;
    end_at: Date | null;
  }[] = [];
  if (tasksQuery.data) {
    tasksQuery.data.forEach((task: task) => {
      tasks.push({
        id: task.id,
        name: task.name,
        description: task.description,
        created_at: task.created_at,
        status: task.status,
        assignees: task.assignees,
        phase_id: task.phase_id,
        end_at: task.end_at,
      });
    });
  }
  return tasks;
};
