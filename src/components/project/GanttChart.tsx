import React from "react";
import { Gantt, type Task } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { type ProjectSummary } from "~/utils/project";
import { useRouterId } from "~/utils/routerId";

type GanttChartProps = {
  projectSummary: ProjectSummary;
  refetch: () => Promise<void>;
};

const GanttChart: React.FC<GanttChartProps> = ({ projectSummary, refetch }) => {
  const router = useRouter();
  const id = useRouterId();
  const test: Task[] = [];

  const updateStartDate = api.task.updateStartDate.useMutation();
  const updateDeadline = api.task.updateDeadline.useMutation();

  const tasks: Task[] = initTest();
  function initTest() {
    let displayCount = 1;
    projectSummary.phases?.map((phase) => {
      if (phase) {
        test.push({
          start: new Date(phase.start_at),
          end: phase.end_at ? new Date(phase.end_at) : new Date(),
          name: phase.name ?? "",
          id: phase.phase_id,
          progress: phase.progress,
          type: "project",
          hideChildren: false,
          displayOrder: displayCount++,
          styles: {
            backgroundColor: "#65179A",
            progressColor: "##EADBEF",
            progressSelectedColor: "##EADBEF",
            backgroundSelectedColor: "#65179A",
          },
        });
      }
      phase?.tasks?.map((task) => {
        if (task) {
          test.push({
            start: new Date(task.start_at),
            end: task.end_at ? new Date(task.end_at) : new Date(),
            name: task.name ?? "",
            id: task.task_id,
            progress: 0,
            type: "task",
            project: phase.phase_id,
            displayOrder: displayCount++,
            styles: {
              backgroundColor: "#935FEF",
              backgroundSelectedColor: "#935FEF",
            },
          });
        }
      });
    });
    return test;
  }

  const handleTaskChange = async (task: Task) => {
    // update the start and deadline of task in database
    if (task.type === "task") {
      const start = task.start;
      const end = task.end;
      await updateStartDate.mutateAsync({
        id: task.id,
        created_at: start,
      });
      await updateDeadline.mutateAsync({
        id: task.id,
        deadline: end,
      });
    }
    await refetch();
  };

  const handleClick = async (task: Task) => {
    await router.push(`/project/${id}/phases`);
  };

  return (
    <Gantt
      tasks={test}
      onDateChange={handleTaskChange}
      onDoubleClick={handleClick}
    />
  );
};

export default GanttChart;
