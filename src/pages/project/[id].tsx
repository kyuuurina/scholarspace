// utils
import { useRouterId } from "~/utils/routerId";
import { useFetchProject } from "~/utils/project";
import { api } from "~/utils/api";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";

// components
import Layout from "~/components/layout/Layout";
import Head from "~/components/layout/Head";
import Header from "~/components/workspace/Header";
import Card from "~/components/Card";
import MembersCard from "~/components/members/MembersCard";
import ScoreChart from "~/components/chart/ScoreChart";
import PageLoader from "~/components/layout/PageLoader";
import {
  Gantt,
  type Task,
  EventOption,
  StylingOption,
  ViewMode,
  DisplayOption,
} from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React from "react";

const Project: NextPageWithLayout = () => {
  const id = useRouterId();
  const {
    name,
    description,
    isLoading,
    error,
    imgUrl,
    c_score,
    p_score,
    users,
  } = useFetchProject();

  const [tasks, setTasks] = React.useState<Task[]>(initTasks());
  const [isChecked, setIsChecked] = React.useState(true);

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
    let start = projectTasks[0].start;
    let end = projectTasks[0].end;

    for (let i = 0; i < projectTasks.length; i++) {
      const task = projectTasks[i];
      if (start.getTime() > task.start.getTime()) {
        start = task.start;
      }
      if (end.getTime() < task.end.getTime()) {
        end = task.end;
      }
    }
    return [start, end];
  }

  const handleTaskChange = (task: Task) => {
    console.log("On date change Id:" + task.id);
    let newTasks = tasks.map((t) => (t.id === task.id ? task : t));
    if (task.project) {
      const [start, end] = getStartEndDateForProject(newTasks, task.project);
      const project =
        newTasks[newTasks.findIndex((t) => t.id === task.project)];
      if (
        project.start.getTime() !== start.getTime() ||
        project.end.getTime() !== end.getTime()
      ) {
        const changedProject = { ...project, start, end };
        newTasks = newTasks.map((t) =>
          t.id === task.project ? changedProject : t
        );
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

  const handleProgressChange = async (task: Task) => {
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
    <>
      <Head title={name} />
      <PageLoader isLoading={isLoading} errorMsg={error?.message}>
        <main className="flex flex-col">
          {/* Project header */}
          <Header name={name || ""} imgUrl={imgUrl} purpose="project" />
          <div className="grid p-5 md:grid-cols-12 md:gap-x-5">
            {/* Left section of workspace dashboard */}
            <div className="w-full md:col-span-8">
              <section className="bg-white">
                <div className="mx-auto max-w-screen-xl px-4 py-4 text-center lg:px-6 lg:py-10">
                  <dl className="mx-auto grid max-w-screen-md gap-8 text-gray-900 sm:grid-cols-3">
                    <div className="flex flex-col items-center justify-center">
                      <dt className="mb-2 text-3xl font-extrabold text-green-500 md:text-4xl">
                        73
                      </dt>
                      <dd className="font-medium text-green-500 ">
                        tasks completed
                      </dd>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <dt className="mb-2 text-3xl font-extrabold text-red-500 md:text-4xl">
                        20
                      </dt>
                      <dd className="font-medium text-red-500 ">
                        unfinshed tasks
                      </dd>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <dt className="mb-2 text-3xl font-extrabold text-blue-500 md:text-4xl">
                        5
                      </dt>
                      <dd className="font-medium text-blue-500 ">
                        closed tasks
                      </dd>
                    </div>
                  </dl>
                </div>
              </section>
              <div className="my-2 overflow-x-auto">
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
                <table className="w-full bg-white text-left text-sm text-gray-500">
                  <thead className="border-grey-50 border text-xs uppercase text-gray-700 ">
                    <tr>
                      <th scope="col" className="p-4">
                        <div className="flex items-center">
                          <input
                            id="checkbox-all"
                            type="checkbox"
                            className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                          />
                          <label htmlFor="checkbox-all" className="sr-only">
                            checkbox
                          </label>
                        </div>
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Name
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Assigned To
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Deadline
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
                      <td className="w-4 px-4 py-3">
                        <div className="flex items-center">
                          <input
                            id="checkbox-table-search-1"
                            type="checkbox"
                            className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                          />
                          <label
                            htmlFor="checkbox-table-search-1"
                            className="sr-only"
                          >
                            checkbox
                          </label>
                        </div>
                      </td>
                      <th
                        scope="row"
                        className="flex items-center whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white"
                      >
                        Task 1
                      </th>
                      <td className="px-4 py-2">
                        <span className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 rounded px-2 py-0.5 text-xs font-medium">
                          Khairina
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          <div className="mr-2 inline-block h-4 w-4 rounded-full bg-red-300"></div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                        22, Sept 23
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
                      <td className="w-4 px-4 py-3">
                        <div className="flex items-center">
                          <input
                            id="checkbox-table-search-1"
                            type="checkbox"
                            className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                          />
                          <label
                            htmlFor="checkbox-table-search-1"
                            className="sr-only"
                          >
                            checkbox
                          </label>
                        </div>
                      </td>
                      <th
                        scope="row"
                        className="flex items-center whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white"
                      >
                        Task 2
                      </th>
                      <td className="px-4 py-2">
                        <span className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 rounded px-2 py-0.5 text-xs font-medium">
                          Khairina
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          <div className="mr-2 inline-block h-4 w-4 rounded-full bg-green-400"></div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                        22, Sept 23
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
                      <td className="w-4 px-4 py-3">
                        <div className="flex items-center">
                          <input
                            id="checkbox-table-search-1"
                            type="checkbox"
                            className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                          />
                          <label
                            htmlFor="checkbox-table-search-1"
                            className="sr-only"
                          >
                            checkbox
                          </label>
                        </div>
                      </td>
                      <th
                        scope="row"
                        className="flex items-center whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white"
                      >
                        Task 3
                      </th>
                      <td className="px-4 py-2">
                        <span className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 rounded px-2 py-0.5 text-xs font-medium">
                          Khairina
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          <div className="mr-2 inline-block h-4 w-4 rounded-full bg-orange-500"></div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                        22, Sept 23
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* Right section of workspace dashboard */}
            <div className="grid w-full gap-y-2 py-5 md:col-span-4 md:py-1">
              <Card title={"About"}>
                <p className="line-clamp-5 text-sm text-gray-900">
                  {description}
                </p>
              </Card>
              <MembersCard id={id} name={"project"} users={users} />
              <Card title={"Collaborative Score"} center>
                <ScoreChart name={"Collaborative"} score={c_score || 0} />
              </Card>
              <Card title={"Productivity Score"} center>
                <ScoreChart name={"Productivity"} score={p_score || 0} />
              </Card>
            </div>
          </div>
        </main>
      </PageLoader>
    </>
  );
};

Project.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};

export default Project;
