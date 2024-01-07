import { api } from "~/utils/api";
import { useRouter } from "next/router";

type CellProps = {
  phase_id: string;
  setIsCellActionOpen: (isCellActionOpen: boolean) => void;
  refetch: () => void;
};

const PhaseActions: React.FC<CellProps> = ({
  phase_id,
  setIsCellActionOpen,
}) => {
  const deletePhase = api.phase.deletePhase.useMutation();
  const router = useRouter();
  const handleRename = () => {
    console.log("rename");
  };
  const handleDelete = async () => {
    await deletePhase.mutateAsync(
      { id: phase_id },
      {
        onSuccess: () => {
          router.reload();
          setIsCellActionOpen(false);
        },
      }
    );
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
    </div>
  );
};

export default PhaseActions;
