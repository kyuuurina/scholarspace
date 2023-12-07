// hooks
import { useState, useEffect } from "react";

// utils
import { api } from "~/utils/api";
import { useFetchTasksWithProperties } from "~/utils/task";

// local components
import EditableCell from "./EditableCell";
import CellActions from "./CellActions";
import PropertyCell from "./PropertyCell";

type TableProps = {
  phase_id: string;
};

const Table: React.FC<TableProps> = ({ phase_id }) => {
  const [isAddColumnVisible, setAddColumnVisible] = useState(false);
  const [editedHeader, setEditedHeader] = useState("");
  const [editingCell, setEditingCell] = useState<{
    rowIndex: number;
    columnIndex: number;
  } | null>(null);

  const [isCellActionOpen, setIsCellActionOpen] = useState(false);

  const handleAddColumnClick = () => {
    setAddColumnVisible(!isAddColumnVisible); // Step 2
  };

  const handleHeaderBlur = () => {
    setAddColumnVisible(false); // Hide the editable column
  };

  // fetch additional properties of phase
  const propertiesQuery = api.phase.getProperties.useQuery({
    phase_id,
  });

  const createProperty = api.phase.addProperty.useMutation();

  const { tasks, refetch } = useFetchTasksWithProperties(phase_id);
  const handleHeaderChange = async (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    if ("key" in event && event.key === "Enter") {
      // Add the new column to the database asynchronously
      await createProperty.mutateAsync({
        phase_id,
        name: editedHeader,
        value: "",
        type: "text",
      });

      await refetch();

      // Reset the edited header and hide the editable column
      setEditedHeader("");
      setAddColumnVisible(false);
    }
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLTableCellElement>) => {
    event.preventDefault();
    setIsCellActionOpen(!isCellActionOpen);
  };

  return (
    <table className="w-full border border-gray-200 text-left text-sm text-gray-700">
      <thead className="bg-gray-50 text-xs uppercase text-gray-700">
        <tr className="whitespace-nowrap border border-gray-300 px-6 py-4">
          <th
            scope="col"
            className="border border-gray-300 px-6 py-3 hover:bg-gray-100"
          >
            Task Name
          </th>
          <th
            scope="col"
            className="border border-gray-300 px-6 py-3 hover:bg-gray-100"
          >
            Start At
          </th>
          <th
            scope="col"
            className="border border-gray-300 px-6 py-3 hover:bg-gray-100"
          >
            Status
          </th>
          <th
            scope="col"
            className="border border-gray-300 px-6 py-3 hover:bg-gray-100"
          >
            Assignee
          </th>

          {propertiesQuery?.data?.map((property, index) => (
            <PropertyCell key={index} property={property} index={index} />
          ))}

          <th scope="col" className="border border-gray-300 px-6 py-3">
            {isAddColumnVisible ? (
              <input
                type="text"
                value={editedHeader}
                autoFocus
                onBlur={handleHeaderBlur}
                onChange={(event) => {
                  event.persist();
                  setEditedHeader(event.target.value);
                }}
                onKeyUp={async (event) => {
                  if (event.key === "Enter") {
                    await handleHeaderChange(event);
                  }
                }}
              />
            ) : (
              <span className="cursor-pointer" onClick={handleAddColumnClick}>
                +
              </span>
            )}
          </th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, rowIndex) => (
          <tr key={task.id} className="border border-gray-300">
            <td className="whitespace-nowrap border border-gray-300 px-6">
              <div className="flex items-center">
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {task.name}
                  </div>
                </div>
              </div>
            </td>
            <td className="whitespace-nowrap border border-gray-300 px-6 py-2">
              {task.start_at?.toLocaleString()}
            </td>
            <td className="whitespace-nowrap border border-gray-300 px-6 py-2">
              {task.status}
            </td>
            <td className="whitespace-nowrap border border-gray-300 px-6 py-2">
              {task.assignees}
            </td>
            {/* iterate properties and render column, */}
            {propertiesQuery?.data?.map((property, columnIndex) => {
              const matchingProperty = task.properties.find(
                (property) => property.id === BigInt(columnIndex)
              );

              return (
                <td
                  key={columnIndex}
                  className=" whitespace-nowrap border border-gray-300 px-6 py-2"
                  onClick={() => setEditingCell({ rowIndex, columnIndex })}
                >
                  {editingCell?.rowIndex === rowIndex &&
                  editingCell?.columnIndex === columnIndex ? (
                    <EditableCell
                      task_id={task.id}
                      property_id={matchingProperty?.property_id || ""}
                      setIsEditing={(value) => {
                        if (!value) {
                          setEditingCell(null);
                        }
                      }}
                    />
                  ) : (
                    matchingProperty?.value
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
