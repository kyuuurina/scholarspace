import React, { useState } from "react";
import { Gantt, type Task } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { api } from "~/utils/api";
import type { GrantSummary } from "~/utils/grant";
import PrimaryButton from "~/components/button/PrimaryButton";
import CreateGrantModal from "~/components/grant/create-grant-form";
import { DeleteButton } from "../button/DeleteButton";
import toast from "react-hot-toast";
import ErrorToast from "../toast/ErrorToast";
import Modal from "../modal/Modal";
import { useRouterId } from "~/utils/routerId";

type GanttChartProps = {
  grantSummary: GrantSummary;
  refetch: () => Promise<void>;
};

const GanttChart: React.FC<GanttChartProps> = ({ grantSummary, refetch }) => {
  const workspaceId = useRouterId();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [grantModalIsOpen, setGrantModalIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const workspaceRole = api.workspace.getWorkspaceRole.useQuery({
    workspaceId: workspaceId,
  });
  const test: Task[] = [];
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
      setSelectedName(task.name);
    } else {
      setSelectedTaskId(null);
    }
  };

  const handleDeleteClick = () => {
    // Use selectedTaskId for your delete logic
    if (selectedTaskId) {
      setIsModalOpen(true);
    }
  };

  const performDelete = async () => {
    if (selectedTaskId) {
      try {
        await deleteGrant.mutateAsync({
          grant_id: selectedTaskId,
        });
        await refetch();
      } catch (error) {
        toast.custom(() => <ErrorToast message="Error deleting grant" />);
      } finally {
        setIsModalOpen(false);
        setSelectedTaskId(null);
      }
    }
  };

  if (!grantSummary.grants || grantSummary.grants.length === 0) {
    return (
      <div className="pb-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium">Grants</h1>
          <p>No grants available for this workspace.</p>
          {workspaceRole.data === "Researcher Admin" && (
            <div className="flex">
              <PrimaryButton
                name="Add Grant"
                onClick={() => setGrantModalIsOpen(true)}
              />
            </div>
          )}
        </div>
        <CreateGrantModal
          openModal={grantModalIsOpen}
          onClick={() => setGrantModalIsOpen(false)}
          refetch={refetch}
        />
      </div>
    );
  }

  return (
    <>
      <CreateGrantModal
        openModal={grantModalIsOpen}
        onClick={() => setGrantModalIsOpen(false)}
        refetch={refetch}
      />
      <div>
        <Modal
          show={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          title={selectedName ? `Delete ${selectedName}` : "Delete Grant"}
        >
          <div>
            <p className="text-md mb-2">
              This will permanently delete the{" "}
              <span className="font-bold">{selectedName}</span> grant and all of
              its associated data.
            </p>
            <p className="mb-2">
              Please confirm that you want to delete this grant.
            </p>
          </div>

          <DeleteButton name="Delete Grant" onClick={performDelete} />
          {/* Cancel button */}
          <button
            className="p-5 text-sm text-gray-500 hover:text-gray-700"
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            Cancel
          </button>
        </Modal>
      </div>
      <div>
        <div className="mb-5 flex items-center justify-between ">
          <h5 className="text-xl font-medium text-gray-900 ">Grants</h5>
          <div className="flex space-x-5">
            <DeleteButton
              onClick={() => {
                handleDeleteClick();
              }}
              name="Delete Grant"
              disabled={!selectedTaskId}
            />
            {workspaceRole.data === "Researcher Admin" && (
              <div className="flex">
                <PrimaryButton
                  name="Add Grant"
                  onClick={() => setGrantModalIsOpen(true)}
                />
              </div>
            )}
          </div>
        </div>

        <Gantt tasks={test} onSelect={handleSelect} />
      </div>
    </>
  );
};

export default GanttChart;
