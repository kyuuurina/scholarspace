import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useRouterId } from "~/utils/routerId";
import toast from "react-hot-toast";
import ErrorToast from "../toast/ErrorToast";
import { TRPCClientError } from "@trpc/client";
import { MoonLoader } from "react-spinners";
import { useState } from "react";
import dynamic from "next/dynamic";
const DeletePhaseModal = dynamic(() => import("./DeletePhaseModal"), {
  ssr: false,
});

type CellProps = {
  phase_id: string;
  setIsCellActionOpen: (isCellActionOpen: boolean) => void;
  onClickRename: () => void; // Add the onClickRename prop
  onClosePhaseActions: () => void; // Add the onClosePhaseActions prop
};

const PhaseActions: React.FC<CellProps> = ({
  phase_id,
  setIsCellActionOpen,
  onClickRename, // Destructure the prop
  onClosePhaseActions,
}) => {
  const deletePhase = api.phase.deletePhase.useMutation();
  const router = useRouter();
  const projectId = useRouterId();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleRename = () => {
    onClosePhaseActions();
    onClickRename(); // Call the function to trigger renaming mode
  };
  const handleDelete = async () => {
    if (isDeleteLoading) return;
    setIsDeleteLoading(true);
    try {
      await deletePhase.mutateAsync(
        { id: phase_id, project_id: projectId },
        {
          onSuccess: () => {
            router.reload();
            setIsCellActionOpen(false);
            onClosePhaseActions();
          },
        }
      );
    } catch (error) {
      toast.custom(() => {
        if (error instanceof TRPCClientError) {
          return <ErrorToast message={error.message} />;
        } else {
          // Handle other types of errors or fallback to a default message
          return <ErrorToast message="An error occurred." />;
        }
      });
    }
    setIsDeleteLoading(false);
  };

  return (
    <>
      <DeletePhaseModal
        handleDelete={handleDelete}
        onClose={() => {
          setIsCellActionOpen(false);
          setIsModalOpen(false);
        }}
        isModalOpen={isModalOpen}
      />
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
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          {isDeleteLoading && (
            <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-white opacity-50">
              <MoonLoader size={20} color={"#1f2937"} />
            </div>
          )}
          Delete
        </button>
      </div>
    </>
  );
};

export default PhaseActions;
