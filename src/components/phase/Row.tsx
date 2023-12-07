// Import necessary libraries
import React, { useState } from "react";
import type { task } from "@prisma/client";
import Avatar from "../avatar/avatar";
import { api } from "~/utils/api";
import SuccessToast from "../toast/SuccessToast";
import TaskDrawer from "./TaskDrawer";
import { motion, AnimatePresence } from "framer-motion";

import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

type RowProps = {
  task: task;
  phase_id: string;
};

const variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: "100%" },
};

const Row: React.FC<RowProps> = ({ task, phase_id }) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(task.status);

  const updateStatusTask = api.task.updateStatus.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Status updated" />);
    },
  });

  const handleStatusClick = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  const handleTaskNameClick = () => {
    setDrawerIsOpen(!drawerIsOpen);
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      setSelectedStatus(newStatus);

      await updateStatusTask.mutateAsync({
        id: task.id,
        status: newStatus,
      });

      setMenuIsOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
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

  const renderStatusDropdown = () => {
    return (
      <div
        className="absolute z-30 w-20 rounded-lg border border-gray-200 bg-white text-gray-900"
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

  const user = api.user.get.useQuery({ id: task.assignees || "" });

  return (
    <tr className="bg-white hover:bg-gray-100">
      <td className="border-b px-6 py-1" onClick={handleTaskNameClick}>
        {task.name}
      </td>
      <td className="border-b px-6 py-1">
        {new Date(task.created_at).toLocaleString("en-US", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })}
      </td>

      <td className="relative border-b px-3 py-1">
        <span
          className={`badge rounded-md p-2 text-xs ${getStatusBadgeClassName(
            selectedStatus
          )}`}
          onClick={handleStatusClick}
        >
          {selectedStatus}
        </span>
        {menuIsOpen && renderStatusDropdown()}
      </td>

      <td className="border-b px-6 py-1">
        {user.data && <div className="h-8">{/* Your Avatar component */}</div>}
      </td>

      {/* Use AnimatePresence to handle the animation of TaskDrawer */}
      <AnimatePresence>
        {drawerIsOpen && (
          <motion.div
            key="drawer"
            initial="closed"
            animate="open"
            exit="closed"
            variants={variants}
            className="fixed inset-0 overflow-hidden"
            style={{ zIndex: 50, transition: "transform 0.5s ease-in-out" }}
          >
            <TaskDrawer task={task} onClose={() => setDrawerIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </tr>
  );
};

export default Row;
