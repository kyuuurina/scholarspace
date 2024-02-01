import React from "react";
import { DeleteButton } from "../button/DeleteButton";
import Modal from "../modal/Modal";
import type { taskList } from "~/types/task";

type TaskModalProps = {
  handleDelete: () => Promise<void>;
  onClose: () => void;
  isModalOpen: boolean;
  task: taskList;
};

const DeleteTaskModal: React.FC<TaskModalProps> = ({
  handleDelete,
  onClose,
  isModalOpen,
  task,
}) => {
  return (
    <>
      <Modal
        show={isModalOpen}
        onClose={() => {
          onClose();
        }}
        title="Delete Task"
      >
        <div>
          <p className="text-md mb-2">
            This will permanently delete the{" "}
            <span className="font-semibold"> {task?.name} </span> task and all
            of its data.
          </p>
          <p className="mb-2">
            Please confirm that you want to delete this task.
          </p>
        </div>

        <DeleteButton name="Delete Task" onClick={handleDelete} />
        {/* Cancel button */}
        <button
          className="p-5 text-sm text-gray-500 hover:text-gray-700"
          onClick={() => {
            onClose();
          }}
        >
          Cancel
        </button>
      </Modal>
    </>
  );
};

export default DeleteTaskModal;
