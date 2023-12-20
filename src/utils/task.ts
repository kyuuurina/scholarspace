import type { task, user } from "@prisma/client";
import { api } from "./api";

export const useFetchTasksWithProperties = (phase_id: string) => {
  const tasks: {
    id: string;
    name: string;
    description: string | null;
    created_at: Date;
    status: string;
    assignees: user[] | undefined;
    phase_id: string;
    end_at: Date | null;
    deadline: Date | null;
    properties: {
      id: bigint;
      property_id: string;
      name: string;
      value: string | null | undefined;
    }[];
    attachments: string[] | null;
  }[] = [];

  const tasksQuery = api.task.list.useQuery(
    {
      phase_id,
    },
    {
      enabled: !!phase_id,
    }
  );

  const assigneesQuery = api.task.getAssignees.useQuery(
    {
      phase_id,
    },
    {
      enabled: !!phase_id,
    }
  );

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
        name: string;
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
            name: matchedProperty.name,
            value: propertyValue.value,
          });
        }
      });

      // Filter assignees for the current task
      const taskAssignees = assigneesQuery?.data?.filter(
        (assignee) => assignee.task_id === task.id
      );

      taskProperties.sort((a, b) => a.name.localeCompare(b.name));
      // Update tasks with assignees
      tasks.push({
        id: task.id,
        name: task.name,
        description: task.description,
        created_at: task.created_at,
        status: task.status,
        assignees: taskAssignees?.map((assignee) => assignee.user),
        phase_id: task.phase_id,
        end_at: task.end_at,
        deadline: task.deadline,
        properties: taskProperties,
        attachments: task.attachments,
      });
    });
  }

  // create refetch function
  const refetch = async () => {
    await tasksQuery.refetch();
    await propertiesQuery.refetch();
    await propertyValuesQuery.refetch();
    await assigneesQuery.refetch();
  };

  tasks.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

  return {
    tasks,
    refetch,
  };
};
