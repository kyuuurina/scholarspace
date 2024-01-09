import React, { useState } from "react";
import {
  Gantt,
  type Task,
  EventOption,
  StylingOption,
  ViewMode,
  DisplayOption,
} from "gantt-task-react";
import "gantt-task-react/dist/index.css";

type GanttChartProps = {
  task: Task;
};

const GanttChart: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initTasks());
  const [isChecked, setIsChecked] = useState(true);

  function initTasks() {
    const currentDate = new Date();
    const tasks: Task[] = [
      {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
        name: "Some Project",
        id: "ProjectSample",
        progress: 25,
        type: "project",
        hideChildren: false,
        displayOrder: 1,
      },
      {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        end: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          2,
          12,
          28
        ),
        name: "Idea",
        id: "Task 0",
        progress: 45,
        type: "task",
        project: "ProjectSample",
        displayOrder: 2,
      },
      {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
        end: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          4,
          0,
          0
        ),
        name: "Research",
        id: "Task 1",
        progress: 25,
        dependencies: ["Task 0"],
        type: "task",
        project: "ProjectSample",
        displayOrder: 3,
      },
      {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
        end: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          8,
          0,
          0
        ),
        name: "Discussion with team",
        id: "Task 2",
        progress: 10,
        dependencies: ["Task 1"],
        type: "task",
        project: "ProjectSample",
        displayOrder: 4,
      },
      {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
        end: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          9,
          0,
          0
        ),
        name: "Developing",
        id: "Task 3",
        progress: 2,
        dependencies: ["Task 2"],
        type: "task",
        project: "ProjectSample",
        displayOrder: 5,
      },
      {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
        name: "Review",
        id: "Task 4",
        type: "task",
        progress: 70,
        dependencies: ["Task 2"],
        project: "ProjectSample",
        displayOrder: 6,
      },
      {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
        name: "Release",
        id: "Task 6",
        progress: currentDate.getMonth(),
        type: "milestone",
        dependencies: ["Task 4"],
        project: "ProjectSample",
        displayOrder: 7,
      },
      {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
        name: "Party Time",
        id: "Task 9",
        progress: 0,
        isDisabled: true,
        type: "task",
      },
    ];
    return tasks;
  }

  function getStartEndDateForProject(tasks: Task[], projectId: string) {
    const projectTasks = tasks.filter((t) => t.project === projectId);

    if (projectTasks.length === 0) {
      return null;
    }

    let start = projectTasks[0]?.start;
    let end = projectTasks[0]?.end;

    for (let i = 0; i < projectTasks.length; i++) {
      const task = projectTasks[i];
      if (task?.start && start!.getTime() > task.start.getTime()) {
        start = task.start;
      }
      if (task?.end && end!.getTime() < task.end.getTime()) {
        end = task.end;
      }
    }

    return [start, end];
  }

  const handleTaskChange = (task: Task) => {
    console.log("On date change Id:" + task.id);
    let newTasks = tasks.map((t) => (t.id === task.id ? task : t));
    if (task.project) {
      const startEndDates = getStartEndDateForProject(newTasks, task.project);
      const start = startEndDates ? startEndDates[0] : new Date();
      const end = startEndDates ? startEndDates[1] : new Date();
      const project =
        newTasks[newTasks.findIndex((t) => t.id === task.project)];
      if (
        project?.start.getTime() !== start!.getTime() ||
        project.end.getTime() !== end!.getTime()
      ) {
        const changedProject = { ...project, start, end };
        newTasks = newTasks.map((t) => ({
          ...t,
          id: t.id || "", // Set id to an empty string if it's undefined
        }));
      }
    }
    setTasks(newTasks);
  };

  const handleTaskDelete = (task: Task) => {
    const conf = window.confirm("Are you sure about " + task.name + " ?");
    if (conf) {
      setTasks(tasks.filter((t) => t.id !== task.id));
    }
    return conf;
  };

  const handleProgressChange = (task: Task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    console.log("On progress change Id:" + task.id);
  };

  const handleDblClick = (task: Task) => {
    alert("On Double Click event Id:" + task.id);
  };

  const handleClick = (task: Task) => {
    console.log("On Click event Id:" + task.id);
  };

  const handleSelect = (task: Task, isSelected: boolean) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const handleExpanderClick = (task: Task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    console.log("On expander click Id:" + task.id);
  };

  return (
    <Gantt
      tasks={tasks}
      onDateChange={handleTaskChange}
      onDelete={handleTaskDelete}
      onProgressChange={handleProgressChange}
      onDoubleClick={handleDblClick}
      onClick={handleClick}
      onSelect={handleSelect}
      onExpanderClick={handleExpanderClick}
      listCellWidth={isChecked ? "155px" : ""}
    />
  );
};

export default GanttChart;
