import { api } from "~/utils/api";
import type { taskRow } from "~/types/task";
import { useState, useEffect } from "react";
import { useFetchTasksWithProperties } from "~/utils/task";
import { set } from "zod";
import MoonLoader from "react-spinners/MoonLoader";

type StatusBadgeProps = {
  task?: taskRow;
  status?: string;
  setStatus?: (status: string) => void;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
  task,
  status,
  setStatus,
}) => {
  const updateStatusTask = api.task.updateStatus.useMutation();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (task && setStatus) {
      setStatus(task.status);
    }
  }, [task, setStatus]);

  const { refetch } = useFetchTasksWithProperties(task?.phase_id || "");
  const renderStatusDropdown = () => {
    return (
      <div
        className="absolute z-30 flex w-20 flex-col rounded-lg border border-gray-200 bg-white text-gray-900"
        style={{ top: "100%", left: "0" }}
      >
        <button
          type="button"
          className="relative inline-flex w-full items-center rounded-t-lg border-b border-gray-200 px-2 py-1 text-sm font-medium hover:bg-gray-100 hover:text-blue-700 focus:z-10 "
          onClick={() => handleStatusChange("pending")}
        >
          Pending
        </button>
        <button
          type="button"
          className="relative inline-flex w-full items-center border-b border-gray-200 px-2 py-1 text-sm font-medium hover:bg-gray-100 hover:text-blue-700 focus:z-10 "
          onClick={() => handleStatusChange("active")}
        >
          Active
        </button>
        <button
          type="button"
          className="relative inline-flex w-full items-center border-b border-gray-200 px-2 py-1 text-sm font-medium hover:bg-gray-100 hover:text-blue-700 focus:z-10 "
          onClick={() => handleStatusChange("done")}
        >
          Done
        </button>
      </div>
    );
  };

  const handleStatusChange = async (newStatus: string) => {
    if (task) {
      try {
        await updateStatusTask.mutateAsync({
          id: task.id,
          status: newStatus,
        });
      } catch (error) {
        console.error("Error updating status:", error);
      } finally {
        setDropdownOpen(false);
        await refetch();
      }
    }

    if (setStatus) {
      setStatus(newStatus);
      setDropdownOpen(false);
    }
  };

  const getStatusBadgeClassName = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-gray-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "done":
        return "bg-green-100 text-green-800";
      default:
        return "bg-yellow-100 text-gray-800";
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        className={`badge flex w-fit cursor-pointer items-center space-x-5 rounded-md p-2 text-xs ${getStatusBadgeClassName(
          task?.status || status || ""
        )}`}
        onClick={() => setDropdownOpen(!isDropdownOpen)}
      >
        {task ? task.status : status}
        {updateStatusTask.isLoading && (
          <MoonLoader size={10} color={"#000000"} loading={true} />
        )}
      </div>
      {isDropdownOpen && renderStatusDropdown()}
    </div>
  );
};

export default StatusBadge;
