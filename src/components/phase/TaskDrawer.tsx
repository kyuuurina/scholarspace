// libraries and hooks
import React, { useState, useEffect } from "react";
import Select, { type MultiValue } from "react-select";
import { useForm } from "react-hook-form";
import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// utils
import { useFetchProjectMembers } from "~/utils/project";
import { useFetchTasksWithProperties } from "~/utils/task";
import { api } from "~/utils/api";

// types
import type { taskRow, TaskFormData } from "~/types/task";
import type { phase_property } from "@prisma/client";

// components
import CommentsSection from "./CommentsSection";
import Avatar from "../avatar/avatar";
import StatusBadge from "./StatusBadge";
import FormErrorMessage from "~/components/FormErrorMessage";
import TaskHeader from "./TaskHeader";
import TaskDescription from "./TaskDescription";
import AttachmentUpload from "./AttachmentUpload";
import StartDatePicker from "./StartDatePicker";

type TaskDrawerProps = {
  task: taskRow;
  onClose: () => void;
  properties: phase_property[] | undefined;
  refetch: () => void;
};

const TaskDrawer: React.FC<TaskDrawerProps> = ({
  task,
  onClose,
  properties,
  refetch,
}) => {
  const [taskStatus, setTaskStatus] = useState("pending");
  const [addAssignees, setAddAssignees] = useState<boolean>(false);
  const [selectedAssignees, setSelectedAssignees] = useState<MultiValue<never>>(
    []
  );

  const handleContentClick = (
    event: React.MouseEvent<HTMLDivElement> | undefined
  ) => {
    // Prevent the click event from reaching the parent div
    event?.stopPropagation();
  };

  console.log("hi");
  const { userDropdown } = useFetchProjectMembers();

  const handleAssigneesChange = (selectedOptions: MultiValue<never>) => {
    setSelectedAssignees(selectedOptions);
  };

  const [tdescription, setTDescription] = useState("");
  return (
    <div
      className="w-300 fixed right-0 top-0 z-10 flex h-screen cursor-default overflow-y-auto border-l border-gray-300 bg-white p-10"
      onClick={handleContentClick}
    >
      <div className="space-y-4">
        {/* Task Header */}
        <TaskHeader
          id={task?.id}
          name={task?.name}
          refetch={refetch}
          onClose={onClose}
        />
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 grid space-y-4">
            <TaskDescription
              id={task?.id}
              description={task?.description}
              refetch={refetch}
            />
            {/* Attachments Section */}
            <AttachmentUpload
              id={task?.id}
              phaseId={task?.phase_id}
              refetch={refetch}
              attachments={task?.attachments}
            />

            {/* Comments Section */}
            {task && <CommentsSection task_id={task?.id} refetch={refetch} />}
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Status
              </label>
              <StatusBadge
                task={task}
                status={taskStatus}
                setStatus={setTaskStatus}
              />
            </div>
            <div>
              <StartDatePicker selectedDate={task?.created_at} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Assignees
              </label>
              {/* {task?.assignees && task?.assignees?.length > 0
                ? // render assignees
                  task.assignees.map((assignee) => (
                    <Avatar
                      key={assignee.id}
                      avatar_url={assignee.avatar_url}
                      email={assignee.email}
                    />
                  )) // render add assignees button
                : !addAssignees && (
                    <button onClick={() => setAddAssignees(!addAssignees)}>
                      Add assignees
                    </button>
                  )} */}

              {/* {addAssignees && (
                // <div ref={ref as React.MutableRefObject<HTMLDivElement>}>
                <Select
                  defaultValue={[]}
                  isMulti
                  name="colors"
                  options={userDropdown}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={(selectedOptions) =>
                    handleAssigneesChange(selectedOptions)
                  }
                />
                // </div>
              )} */}
            </div>
            {/* render properties input fields */}
            {properties?.map((property) => (
              <div key={property.id}>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  {property.name}
                </label>
                <input
                  type="text"
                  className="focus:ring-primary-600 focus:border-primary-600 dark:dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900  "
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDrawer;
