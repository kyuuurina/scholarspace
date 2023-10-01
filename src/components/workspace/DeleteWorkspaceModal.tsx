import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

// local components
import Modal from "../modal/Modal";
import { DeleteButton } from "../button/DeleteButton";
import SuccessToast from "../toast/SuccessToast";
import ErrorToast from "../toast/ErrorToast";

type ModalProps = {
  openModal: boolean;
  onClick: () => void;
  name?: string | null;
  id: string;
};

export const DeleteWorkspaceModal: React.FC<ModalProps> = ({
  openModal,
  onClick,
  name = "workspace",
  id,
}) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const { mutateAsync: deleteWorkspace } = api.workspace.delete.useMutation();

  const [inputValue, setInputValue] = useState("");

  const handleDeleteWorkspace = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      await deleteWorkspace({
        id: id,
      });
    } catch (error) {
      console.error("Error deleting workspace:", error);
      toast.custom(() => <ErrorToast message="Error deleting workspace" />);
    } finally {
      setIsDeleting(false);
      void router.push("/");
      toast.custom(() => <SuccessToast message="Workspace deleted" />);
    }
  };

  return (
    <div>
      <Modal
        show={openModal}
        onClose={() => {
          onClick();
        }}
        title={name ? `Delete ${name}` : "Delete Workspace"}
      >
        <div>
          <p className="text-md mb-2">
            This will permanently delete the{" "}
            <span className="font-bold">{name}</span> project and all of its
            data.
          </p>
          <p className="mb-2">
            Please type in the name of the workspace to confirm.
          </p>
          <input
            id="name"
            className="block w-full"
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
        </div>

        <DeleteButton
          name="Delete Workspace"
          onClick={
            inputValue === name
              ? handleDeleteWorkspace
              : () => console.log("Test")
          }
          disabled={inputValue !== name}
        />
      </Modal>
    </div>
  );
};
