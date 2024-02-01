import React from "react";
import { DeleteButton } from "../button/DeleteButton";
import Modal from "../modal/Modal";

type PhaseModalProps = {
  handleDelete: () => Promise<void>;
  onClose: () => void;
  isModalOpen: boolean;
};

const DeletePhaseModal: React.FC<PhaseModalProps> = ({
  handleDelete,
  onClose,
  isModalOpen,
}) => {
  return (
    <>
      <Modal
        show={isModalOpen}
        onClose={() => {
          onClose();
        }}
        title="Delete Phase"
      >
        <div>
          <p className="text-md mb-2">
            This will permanently delete the phase and its associated data.
          </p>
          <p className="mb-2">
            Please confirm that you want to delete this phase.
          </p>
        </div>

        <DeleteButton name="Delete Phase" onClick={handleDelete} />
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

export default DeletePhaseModal;
