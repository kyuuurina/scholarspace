import React, { useState } from "react";
import { Gantt, type Task } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import type { GrantSummary } from "~/utils/grant";
import PrimaryButton from "~/components/button/PrimaryButton";
import CreateGrantModal from "~/components/grant/create-grant-form";
import { DeleteButton } from "../button/DeleteButton";

type GanttChartProps = {
  grantSummary: GrantSummary;
  refetch: () => Promise<void>;
};

import { useFetchGrantSummary } from "~/utils/grant";

const GanttChart: React.FC<GanttChartProps> = ({ grantSummary, refetch }) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [grantModalIsOpen, setGrantModalIsOpen] = useState(false);

  const router = useRouter();
  // const { grantSummary: query, refetch } = useFetchGrantSummary(id);
  const test: Task[] = [];

  const tasks: Task[] = initTest();
  function initTest() {
    let displayCount = 1;
    grantSummary.grants?.map((grant) => {
      if (grant) {
        test.push({
          start: new Date(grant.start_at),
          end: grant.end_at ? new Date(grant.end_at) : new Date(),
          name: grant.name ?? "",
          id: grant.id,
          progress: grant.progress,
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
      grant?.projects?.map((project) => {
        if (project) {
          test.push({
            start: new Date(project.start_at),
            end: project.end_at ? new Date(project.end_at) : new Date(),
            name: project.name ?? "",
            id: project.id,
            progress: 0,
            type: "task",
            project: grant.id,
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

  // delete grant
  const deleteGrant = api.grant.delete.useMutation();

  const handleSelect = (task: Task, isSelected: boolean) => {
    if (isSelected && task.type === "project") {
      setSelectedTaskId(task.id);
    } else {
      setSelectedTaskId(null);
    }
  };

  const handleDeleteClick = async () => {
    // Use selectedTaskId for your delete logic
    if (selectedTaskId) {
      await deleteGrant.mutateAsync({
        grant_id: selectedTaskId,
      });
      await refetch();
      setSelectedTaskId(null);
    }
  };

  return (
    <>
      <CreateGrantModal
        openModal={grantModalIsOpen}
        onClick={() => setGrantModalIsOpen(false)}
        refetch={refetch}
      />
      <div>
        <div className="mb-5 flex items-center justify-between ">
          <h5 className="text-xl font-medium text-gray-900 ">Grants</h5>
          <div className="flex space-x-5">
            <DeleteButton
              onClick={async () => {
                await handleDeleteClick();
              }}
              name="Delete Grant"
              disabled={!selectedTaskId}
            />
            <PrimaryButton
              name="Add Grant"
              onClick={() => setGrantModalIsOpen(true)}
            />
          </div>
        </div>

        <Gantt tasks={test} onSelect={handleSelect} />
      </div>
    </>
  );
};

export default GanttChart;
