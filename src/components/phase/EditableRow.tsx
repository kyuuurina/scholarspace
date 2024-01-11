import React, { useState, useEffect, useRef } from "react";
import { api } from "~/utils/api";
import { useFetchTasksWithProperties } from "~/utils/task";
import { useClickAway } from "@uidotdev/usehooks";

type EditableRowProps = {
  phase_id: string;
};

const EditableRow: React.FC<EditableRowProps> = ({ phase_id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState("");
  const inputRef = useClickAway(() => {
    setIsEditing(false);
  });

  // pass in phase_id and name for task
  const createTask = api.task.addTaskRow.useMutation();
  const { refetch } = useFetchTasksWithProperties(phase_id ?? "");

  useEffect(() => {
    if (isEditing && inputRef.current) {
      (inputRef.current as HTMLInputElement).focus();
    }
  }, [isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedValue("");
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && editedValue.trim() !== "") {
      // Assuming you have a function to handle creating a task
      await createTask.mutateAsync({
        phase_id,
        name: editedValue,
      });

      setIsEditing(false);
      await refetch();
    }
  };

  return (
    <tr
      key={phase_id}
      className="border border-gray-300 p-2"
      onClick={handleEditClick}
    >
      {isEditing ? (
        <td>
          <input
            ref={inputRef as React.MutableRefObject<HTMLInputElement>}
            type="text"
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            onKeyUp={handleKeyPress}
            className="w-full border-none bg-transparent shadow-none outline-none"
          />
        </td>
      ) : (
        <td className="ml-4 p-2">+ Add row...</td>
      )}
    </tr>
  );
};

export default EditableRow;
