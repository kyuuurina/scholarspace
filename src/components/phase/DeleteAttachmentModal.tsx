import React from "react";
import { DeleteButton } from "../button/DeleteButton";
import Modal from "../modal/Modal";

type AttachmentModalProps = {
  handleDelete: () => Promise<void>;
  onClose: () => void;
  isModalOpen: boolean;
};

const DeleteAttachmentModal: React.FC<AttachmentModalProps> = ({
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
        title="Delete Attachment"
      >
        <div>
          <p className="text-md mb-2">
            This will permanently delete the attachment and its associated data.
          </p>
          <p className="mb-2">
            Please confirm that you want to delete this attachment.
          </p>
        </div>

        <DeleteButton name="Delete Attachment" onClick={handleDelete} />
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

export default DeleteAttachmentModal;
