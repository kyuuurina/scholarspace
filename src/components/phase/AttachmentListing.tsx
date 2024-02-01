import {
  FaFilePdf,
  FaFilePowerpoint,
  FaFileExcel,
  FaFileWord,
  FaFileDownload,
  FaImage,
  FaTrash,
  FaEdit,
} from "react-icons/fa";

type AttachmentListingProps = {
  name?: string;
  type?: string;
  fileLink: string;
  onDelete?: () => void; // onDelete callback function
};

import Link from "next/link";

const AttachmentListing: React.FC<AttachmentListingProps> = ({
  name,
  type,
  fileLink,
  onDelete,
}) => {
  const fileTypeToKeyword = {
    "application/pdf": "PDF",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "Word",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      "Excel",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "Powerpoint",
    "image/png": "Image",
    "image/jpeg": "Image",
  }[type ?? ""];

  const fileTypeToIcon = {
    "application/pdf": (
      <FaFilePdf className="inline-block h-4 w-4 text-red-600" />
    ),
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": (
      <FaFileWord className="inline-block h-4 w-4 text-blue-700" />
    ),
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": (
      <FaFileExcel className="inline-block h-4 w-4 text-green-700" />
    ),
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      <FaFilePowerpoint className="inline-block h-4 w-4 text-orange-700" />,
    "image/png": <FaImage className="inline-block h-4 w-4 text-gray-600" />,
    "image/jpeg": <FaImage className="inline-block h-4 w-4 text-gray-600" />,
  }[type ?? ""];

  return (
    <div className="mb-2 flex max-w-md items-start rounded-xl bg-gray-50 p-4 dark:bg-gray-700">
      <div className="me-2 flex-shrink-0">
        <div className="flex max-w-sm space-x-2">
          <span className="line-clamp-1 flex items-center gap-2 truncate text-sm font-medium text-gray-900 dark:text-white">
            {name}
          </span>
          <Link href={fileLink} target="_blank" rel="noopener noreferrer">
            <FaFileDownload className="fa-icons inline-block h-3 w-3" />
          </Link>
          {onDelete && (
            <button
              className="cursor-pointer"
              onClick={onDelete}
              title="Delete"
            >
              <FaTrash className="fa-icons inline-block h-3 w-3 text-red-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttachmentListing;
