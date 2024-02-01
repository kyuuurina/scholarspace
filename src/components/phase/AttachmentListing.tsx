import { FaFileDownload, FaTrash } from "react-icons/fa";
import dynamic from "next/dynamic";
const DeleteAttachmentModal = dynamic(
  () => import("../phase/DeleteAttachmentModal")
);
type AttachmentListingProps = {
  name?: string;
  fileLink: string;
  onDelete: () => Promise<void>; // onDelete callback function
};

import Link from "next/link";
import { useState } from "react";

const AttachmentListing: React.FC<AttachmentListingProps> = ({
  name,
  fileLink,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <DeleteAttachmentModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleDelete={onDelete}
      />
      <div className="mb-2 flex max-w-md items-start rounded-xl bg-gray-50 p-4 dark:bg-gray-700">
        <div className="me-2 flex-shrink-0">
          <div className="flex max-w-sm space-x-2">
            <span className="line-clamp-1 flex items-center gap-2 truncate text-sm font-medium text-gray-900 dark:text-white">
              {name}
            </span>
            <Link href={fileLink} target="_blank" rel="noopener noreferrer">
              <FaFileDownload className="fa-icons inline-block h-3 w-3" />
            </Link>
            <button
              className="cursor-pointer"
              onClick={() => {
                setIsModalOpen(true);
              }}
              title="Delete"
            >
              <FaTrash className="fa-icons inline-block h-3 w-3 text-red-500" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AttachmentListing;
