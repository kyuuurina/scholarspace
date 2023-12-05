// utils/productivityCalculator.ts

import { api } from "./api";
type task = {
  id: string;
  created_at: Date;
  name: string;
  description: string | null;
  status: string;
  assignees: string | null;
  phase_id: string;
  end_at: Date | null;
};
/**
 * Calculate productivity score based on completed tasks and durations.
 * @returns {number} Productivity score.
 */
function calculateProductivityScore(phase_id: string): number {
  // Fetch completed tasks for productivity calculation
  const completedTasks = fetchCompletedTasks(phase_id);

  if (!completedTasks || completedTasks.length === 0) {
    return 0; // No completed tasks, productivity score is 0
  }

  const completionRatio = completedTasks.length / getTotalTasks(phase_id);

  const averageDuration =
    completedTasks.reduce(
      (total, task) =>
        total +
        (task.end_at instanceof Date
          ? task.end_at.getTime() - task.created_at.getTime()
          : 0),
      0
    ) / completedTasks.length;

  // Customize the scoring method based on your specific requirements
  const completionScore = completionRatio * 100;
  const durationScore = calculateDurationScore(averageDuration);

  // You may adjust the weights or combine the scores differently based on your needs
  const weightedScore = (completionScore + durationScore) / 2;

  return weightedScore;
}

function fetchCompletedTasks(phase_id: string): task[] {
  const tasks = api.task.listTaskbyStatus.useQuery(
    {
      phase_id,
      status: "done",
    },
    {
      enabled: true,
    }
  );

  if (!tasks.data) {
    return [];
  }
  return tasks.data;
}

function calculateDurationScore(averageDuration: number): number {
  // Customize the scoring method based on your specific requirements
  // For example, shorter durations result in higher scores
  const maxDuration = 86400000; // 24 hours in milliseconds
  const durationScore = 100 - (averageDuration / maxDuration) * 100;

  return durationScore;
}

function getTotalTasks(phase_id: string): number {
  const tasksQuery = api.task.list.useQuery(
    {
      phase_id,
    },
    {
      enabled: !!phase_id,
    }
  );

  // check if tasksQuery.data is null, else return 0
  if (!tasksQuery.data) {
    return 0;
  }
  return tasksQuery.data.length;
}

export { calculateProductivityScore };
