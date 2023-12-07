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

export const useFetchTasksWithProperties = (phase_id: string) => {
  const tasksQuery = api.task.list.useQuery(
    {
      phase_id,
    },
    {
      enabled: !!phase_id,
    }
  );

  const tasks: {
    id: string;
    name: string;
    description: string | null;
    start_at: Date;
    status: string;
    assignees: string | null;
    phase_id: string;
    end_at: Date | null;
    properties: {
      id: bigint;
      property_id: string;
      value: string | null;
    }[];
  }[] = [];

  const propertiesQuery = api.phase.getProperties.useQuery(
    {
      phase_id,
    },
    {
      enabled: !!phase_id,
    }
  );

  const propertyValuesQuery = api.phase.getPropertyValues.useQuery(
    {
      phase_id,
    },
    {
      enabled: !!phase_id,
    }
  );

  if (tasksQuery.data && propertiesQuery.data && propertyValuesQuery.data) {
    tasksQuery.data.forEach((task: task) => {
      const taskProperties: {
        id: bigint;
        property_id: string;
        value: string | null;
      }[] = [];

      // Filter property values for the current task
      const taskPropertyValues = propertyValuesQuery.data.filter(
        (propertyValue) =>
          propertyValue.task_id === task.id &&
          propertiesQuery.data.some(
            (property) => property.id === propertyValue.property_id
          )
      );

      // Match property values with properties
      taskPropertyValues.forEach((propertyValue) => {
        const matchedProperty = propertiesQuery.data.find(
          (property) => property.id === propertyValue.property_id
        );

        if (matchedProperty) {
          taskProperties.push({
            id: propertyValue.index,
            property_id: matchedProperty.id,
            value: propertyValue.value,
          });
        }
      });

      tasks.push({
        id: task.id,
        name: task.name,
        description: task.description,
        start_at: task.created_at,
        status: task.status,
        assignees: task.assignees,
        phase_id: task.phase_id,
        end_at: task.end_at,
        properties: taskProperties,
      });
    });
  }

  // create refetch function
  const refetch = async () => {
    await tasksQuery.refetch();
    await propertiesQuery.refetch();
    await propertyValuesQuery.refetch();
  };

  return {
    tasks,
    refetch,
  };
};
