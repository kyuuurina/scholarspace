import React, { useState } from "react";
import Select, { type MultiValue } from "react-select";
import { api } from "~/utils/api";
import Avatar from "../avatar/avatar";
import type { user } from "@prisma/client";
import { useFetchProjectMembers } from "~/utils/project";

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

  const handleAssigneesChange = (
    selectedOptions: MultiValue<{ value: string }>
  ) => {
    // Store selected options in state
    setSelectedOptions(selectedOptions);
  };

  const handleAssigneesBlur = async () => {
    // update assignees on blur
    if (task_id && phase_id) {
      await updateAssignees.mutateAsync({
        task_id,
        assignees: selectedOptions.map((option) => option.value),
        phase_id,
      });
    }
    refetch();
    setIsSelectOpen(false);
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-900">
        Assignees
      </label>

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
          {assignees.map((assignee) => (
            <Avatar key={assignee.id} user={assignee} />
          ))}
        </div>
      ) : (
        <button onClick={() => setIsSelectOpen(!isSelectOpen)}>
          Add assignees
        </button>
      )}
    </div>
  );
};

export default TaskAssignees;
