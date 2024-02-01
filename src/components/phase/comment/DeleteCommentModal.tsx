import React from "react";
import { DeleteButton } from "~/components/button/DeleteButton";
import Modal from "~/components/modal/Modal";

type commentModalProps = {
  handleDelete: () => Promise<void>;
  onClose: () => void;
  isModalOpen: boolean;
};

const DeleteCommentModal: React.FC<commentModalProps> = ({
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
        title="Delete comment"
      >
        <div>
          <p className="text-md mb-2">
            This will permanently delete the comment and its associated data.
          </p>
          <p className="mb-2">
            Please confirm that you want to delete this comment.
          </p>
        </div>

        <DeleteButton name="Delete comment" onClick={handleDelete} />
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

export default DeleteCommentModal;
