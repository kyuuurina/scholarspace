import { api } from "~/utils/api";
import { useState } from "react";
import { useFetchTasksWithProperties } from "~/utils/task";
import { set } from "zod";

type CellProps = {
  property_id: string;
  setIsCellActionOpen: (isCellActionOpen: boolean) => void;
};

const CellActions: React.FC<CellProps> = ({
  property_id,
  setIsCellActionOpen,
}) => {
  const deleteProperty = api.phase.deleteProperty.useMutation();

  const propertyQuery = api.phase.getProperty.useQuery({
    id: property_id,
  });

  const { refetch } = useFetchTasksWithProperties(
    propertyQuery.data?.phase_id ?? ""
  );
  const handleRename = () => {
    console.log("rename");
  };
  const handleDelete = async () => {
    deleteProperty.mutate({ id: property_id });
    await refetch();
    setIsCellActionOpen(false);
  };
  const handleEditType = () => {
    console.log("edit type");
  };
  return (
    <div
      className="absolute z-30 flex w-full flex-col rounded-lg border border-gray-200 bg-white text-gray-900"
      style={{ top: "100%", left: "0" }}
    >
      <button
        type="button"
        className="relative inline-flex w-full items-center rounded-t-lg border-b border-gray-200 px-2 py-1 text-sm font-medium hover:bg-gray-100 hover:text-blue-700 focus:z-10 "
        onClick={handleRename}
      >
        Rename
      </button>
      <button
        type="button"
        className="relative inline-flex w-full items-center border-b border-gray-200 px-2 py-1 text-sm font-medium hover:bg-gray-100 hover:text-blue-700 focus:z-10 "
        onClick={handleDelete}
      >
        Delete
      </button>
      <button
        type="button"
        className="relative inline-flex w-full items-center border-b border-gray-200 px-2 py-1 text-sm font-medium hover:bg-gray-100 hover:text-blue-700 focus:z-10 "
        onClick={handleEditType}
      >
        Edit
      </button>
    </div>
  );
};

export default CellActions;
