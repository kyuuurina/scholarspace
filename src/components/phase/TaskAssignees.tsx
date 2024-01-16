import React, { useState } from "react";
import Select, { type MultiValue } from "react-select";
import { api } from "~/utils/api";
import Avatar from "../avatar/avatar";
import type { user } from "@prisma/client";
import { useFetchProjectMembers } from "~/utils/project";
import { MoonLoader } from "react-spinners";
import toast from "react-hot-toast";
import ErrorToast from "../toast/ErrorToast";
import { TRPCClientError } from "@trpc/client";

type TaskAssigneesProps = {
  task_id: string | undefined;
  assignees: user[] | undefined;
  phase_id?: string | undefined;
  refetch: () => void;
};

const TaskAssignees: React.FC<TaskAssigneesProps> = ({
  task_id,
  assignees,
  phase_id,
  refetch,
}) => {
  // fetch project members
  const { userDropdown } = useFetchProjectMembers();
  // update assignees based on selected options
  const updateAssignees = api.task.updateAssignees.useMutation();
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<
    MultiValue<{ value: string }>
  >([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAssigneesChange = (
    selectedOptions: MultiValue<{ value: string }>
  ) => {
    // Store selected options in state
    setSelectedOptions(selectedOptions);
  };

  const handleAssigneesBlur = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    // update assignees on blur
    if (task_id && phase_id) {
      try {
        await updateAssignees.mutateAsync({
          task_id,
          assignees: selectedOptions.map((option) => option.value),
          phase_id,
        });
        refetch();
      } catch (error) {
        toast.custom(() => {
          if (error instanceof TRPCClientError) {
            return <ErrorToast message={error.message} />;
          } else {
            // Handle other types of errors or fallback to a default message
            return <ErrorToast message="An error occurred." />;
          }
        });
      }
    }
    setIsSelectOpen(false);
    setIsUpdating(false);
  };

  return (
    <div>
      {isSelectOpen ? (
        <Select
          defaultValue={selectedOptions}
          isMulti
          name="colors"
          options={userDropdown}
          className="basic-multi-select w-52"
          classNamePrefix="select"
          onChange={(selectedOptions) => handleAssigneesChange(selectedOptions)}
          onBlur={() => handleAssigneesBlur()}
          closeMenuOnSelect={false}
        />
      ) : assignees && assignees.length > 0 ? (
        <div
          className="flex cursor-pointer flex-row space-x-3"
          onClick={() => setIsSelectOpen(!isSelectOpen)}
        >
          {isUpdating ? (
            <MoonLoader size={20} />
          ) : (
            assignees.map((assignee) => (
              <Avatar key={assignee.id} user={assignee} />
            ))
          )}
        </div>
      ) : (
        <button onClick={() => setIsSelectOpen(!isSelectOpen)}>
          Add assignees...
        </button>
      )}
    </div>
  );
};

export default TaskAssignees;
