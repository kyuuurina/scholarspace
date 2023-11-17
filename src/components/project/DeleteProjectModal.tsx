import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

// local components
import Modal from "../modal/Modal";
import { DeleteButton } from "../button/DeleteButton";
import SuccessToast from "../toast/SuccessToast";
import ErrorToast from "../toast/ErrorToast";

import { useFetchProject } from "~/utils/project";

type ModalProps = {
  openModal: boolean;
  onClick: () => void;
  name?: string | null;
  id: string;
};

const DeleteProjectModal: React.FC<ModalProps> = ({
  openModal,
  onClick,
  name = "project",
  id,
}) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { workspace_id } = useFetchProject();

  const { mutateAsync: deleteProject } = api.project.delete.useMutation();

  const [inputValue, setInputValue] = useState("");

  const handleDeleteProject = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      await deleteProject({
        project_id: id,
      });
    } catch (error) {
      toast.custom(() => <ErrorToast message={(error as Error).toString()} />);
    } finally {
      setIsDeleting(false);
      // go to workspace dashboard
      if (workspace_id !== undefined) {
        void router.push(`/workspace/${workspace_id}`);
      } else {
        // Handle the case where workspace_id is undefined, e.g., provide a default value or throw an error.
        void router.push(`/`);
      }
      toast.custom(() => <SuccessToast message="Project deleted" />);
    }
  };

  return (
    <div>
      <Modal
        show={openModal}
        onClose={() => {
          onClick();
        }}
        title={name ? `Delete ${name}` : "Delete Project"}
      >
        <div>
          <p className="text-md mb-2">
            This will permanently delete the{" "}
            <span className="font-bold">{name}</span> project and all of its
            data.
          </p>
          <p className="mb-2">
            Please type in the name of the project to confirm.
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
          name="Delete Project"
          onClick={
            inputValue === name
              ? handleDeleteProject
              : () => console.log("Test")
          }
          disabled={inputValue !== name}
        />
      </Modal>
    </div>
  );
};

export default DeleteProjectModal;
