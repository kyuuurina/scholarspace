// libraries and hooks
import React, { useState } from "react";

// utils
import { api } from "~/utils/api";

// types
import type { taskRow } from "~/types/task";
import type { phase_property } from "@prisma/client";

// components
import CommentsSection from "./comment/CommentsSection";
import StatusBadge from "./StatusBadge";
import TaskHeader from "./TaskHeader";
import TaskDescription from "./TaskDescription";
import AttachmentUpload from "./AttachmentUpload";
import NonNullableDatePicker from "./NonNullableDatePicker";
import NullableDatePicker from "./NullableDatePicker";
import TaskAssignees from "./TaskAssignees";
import TaskProperty from "./TaskProperty";

type TaskDrawerProps = {
  task: taskRow;
  onClose: () => void;
  properties: phase_property[] | undefined;
  refetch: () => void;
};

const TaskDrawer: React.FC<TaskDrawerProps> = ({
  task,
  onClose,
  refetch,
}) => {
  const [taskStatus, setTaskStatus] = useState("pending");

  const handleContentClick = (
    event: React.MouseEvent<HTMLDivElement> | undefined
  ) => {
    // Prevent the click event from reaching the parent div
    event?.stopPropagation();
  };


  // date
  const [startDate, setStartDate] = useState<Date | undefined>(
    task?.created_at
  );
  const updateStartDate = api.task.updateStartDate.useMutation();

  const onStartDateChange = async (date: Date | undefined) => {
    if (task?.id && date) {
      console.log(date);
      try {
        await updateStartDate.mutateAsync({
          id: task.id,
          created_at: date,
        });
      } finally {
        refetch();
      }
    }
  };
  // date
  const [deadline, setDeadline] = useState<Date | undefined | null>(
    task?.deadline
  );
  const updateDeadline = api.task.updateDeadline.useMutation();

  const onDeadlineChange = async (date: Date | undefined | null) => {
    if (task?.id && date) {
      console.log(date);
      try {
        await updateDeadline.mutateAsync({
          id: task.id,
          deadline: date,
        });
      } finally {
        refetch();
      }
    }
  };
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
            <NonNullableDatePicker
              selectedDate={startDate}
              onChange={async (date) => {
                setStartDate(date);
                await onStartDateChange(date);
              }}
              label="Start Date"
            />
            <NullableDatePicker
              selectedDate={deadline}
              onChange={async (date) => {
                setDeadline(date);
                await onDeadlineChange(date);
              }}
              label="Deadline"
            />
            <TaskAssignees
              task_id={task?.id}
              assignees={task?.assignees}
              phase_id={task?.phase_id}
              refetch={refetch}
            />
            {/* render properties input fields */}
            {task?.properties.map((property) => (
              <TaskProperty
                key={property.property_id}
                task_id={task?.id}
                property_id={property.property_id}
                value={property.value}
                refetch={refetch}
                label={property.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDrawer;
