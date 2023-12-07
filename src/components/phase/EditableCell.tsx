import { api } from "~/utils/api";
import { useState } from "react";
import { useFetchTasksWithProperties } from "~/utils/task";

type CellProps = {
  task_id: string;
  property_id: string;
  setIsEditing: (isEditing: boolean) => void;
};

const EditableCell: React.FC<CellProps> = ({
  task_id,
  property_id,
  setIsEditing,
}) => {
  const [newValue, setNewValue] = useState("");
  const updateProperty = api.task.updateProperty.useMutation();

  // get phase id of property
  const phase_id = api.task.get.useQuery({
    id: task_id,
  }).data?.phase_id;

  const { refetch } = useFetchTasksWithProperties(phase_id ?? "");

  // handler onEnter
  const handleValueChange = async (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    if ("key" in event && event.key === "Enter") {
      // Add the new column to the database asynchronously
      await updateProperty.mutateAsync({
        task_id,
        property_id,
        value: newValue,
      });

      // Reset the edited header and hide the editable column
      setNewValue("");
      setIsEditing(false);
      await refetch();
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <input
      type="text"
      value={newValue}
      autoFocus
      onChange={(event) => {
        event.persist();
        setNewValue(event.target.value);
      }}
      onKeyUp={async (event) => {
        if (event.key === "Enter") {
          await handleValueChange(event);
        }
      }}
    />
  );
};

export default EditableCell;
