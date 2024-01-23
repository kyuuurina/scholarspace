// hooks
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// utils
import { api } from "~/utils/api";
import { useRouterId } from "~/utils/routerId";

// local components
import EditableCell from "./EditableCell";
import PropertyCell from "./PropertyCell";
import StatusBadge from "./StatusBadge";
import EditableRow from "./EditableRow";
import TaskDrawer from "./TaskDrawer";
import TaskAssignees from "./TaskAssignees";

import type { taskRow } from "~/types/task";
type TableProps = {
  phase_id: string;
  searchQuery: string;
};

const variants = {
  open: { x: 0 },
  closed: { x: "100%" },
};

const Table: React.FC<TableProps> = ({ phase_id, searchQuery }) => {
  const [isAddColumnVisible, setAddColumnVisible] = useState(false);
  const [editedHeader, setEditedHeader] = useState("");
  const id = useRouterId();
  const [editingCell, setEditingCell] = useState<{
    rowIndex: number;
    columnIndex: number;
  } | null>(null);
  const [taskDrawerOpen, setTaskDrawerOpen] = useState<{
    [taskId: string]: boolean;
  }>({});
  const [selectedTask, setSelectedTask] = useState<taskRow>();
  const [selectedTaskId, setSelectedTaskId] = useState("");

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

  // GET tasks
  const { data: tasksList, refetch } = api.task.list.useQuery({ phase_id });

  console.log("tasksList", tasksList);

  const createProperty = api.phase.addProperty.useMutation();

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

  const handleTaskClick = (taskId: string) => {
    // Toggle the state for the clicked task
    setTaskDrawerOpen((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }));
  };

  const filteredTasks = tasksList?.filter((task) =>
    task?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!tasksList || !filteredTasks) {
    return null;
  }

  return (
    <div>
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
                <span
                  className="cursor-pointer"
                  onClick={() => handleAddColumnClick()}
                >
                  +
                </span>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks?.map((task, rowIndex) => (
            <tr key={task?.id} className="border border-gray-300">
              <td className="whitespace-nowrap border border-gray-300 px-6">
                <div className="flex items-center">
                  <div className="ml-4">
                    <div
                      className="text-sm font-medium text-gray-900 hover:cursor-pointer hover:text-purple-900"
                      onClick={() => task && handleTaskClick(task.id)}
                    >
                      {task?.name ?? ""}
                      <AnimatePresence>
                        {task && taskDrawerOpen[task.id] && (
                          <motion.div
                            key={`drawer-${task.id}`}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={variants}
                            className="fixed inset-0 overflow-hidden"
                            style={{
                              zIndex: 50,
                              transition: "transform 0.13s linear",
                            }}
                          >
                            <TaskDrawer
                              task={task}
                              properties={propertiesQuery?.data}
                              onClose={() => handleTaskClick(task.id)}
                              refetch={refetch}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap border border-gray-300 px-6 py-2">
                {task?.created_at?.toLocaleString() ?? ""}
              </td>
              <td className="whitespace-nowrap border border-gray-300 px-6 py-2">
                <StatusBadge task={task} />
              </td>
              <td className="whitespace-nowrap border border-gray-300 px-6 py-2">
                {/* iterate over tasks assignees */}
                <TaskAssignees
                  task_id={task?.id}
                  assignees={task?.task_assignees}
                  phase_id={phase_id}
                  refetch={refetch}
                  project_id={id}
                />
              </td>
              {/* iterate properties and render column, */}
              {propertiesQuery?.data?.map((property, columnIndex) => {
                const matchingProperty = task?.property_phase_task?.find(
                  (property_phase_task) =>
                    property_phase_task.property_id === property.id
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
                        task_id={task?.id}
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
          <EditableRow phase_id={phase_id} />
        </tbody>
      </table>
    </div>
  );
};

export default Table;
