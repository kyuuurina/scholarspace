import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

// local components
import Modal from "../modal/Modal";
import SuccessToast from "../toast/SuccessToast";
import ErrorToast from "../toast/ErrorToast";
import Button from "../button/Button";

type ModalProps = {
  openModal: boolean;
  onClick: () => void;
  name?: string | null;
  id: string;
};

const LeaveProjectModal: React.FC<ModalProps> = ({
  openModal,
  onClick,
  name = "project",
  id,
}) => {
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);

  const { mutateAsync: leaveProject } = api.project.leave.useMutation();

  const handleLeaveProject = async () => {
    if (isLeaving) return;
    try {
      setIsLeaving(true);
      await leaveProject({
        project_id: id,
      });
      // Display success toast when leaving the workspace is successful
      toast.custom(() => <SuccessToast message="Successfully left" />);
      void router.push("/");
    } catch (error) {
      onClick();
      toast.custom(() => <ErrorToast message={(error as Error).toString()} />);
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <div>
      <Modal
        show={openModal}
        onClose={() => {
          onClick();
        }}
        title={name ? `Leave ${name}` : "Leave Project"}
      >
        <div>
          <p className="text-md mb-2">
            Are you sure you want to leave{" "}
            <span className="font-bold">{name}</span>? All your contributions
            will remain, but you won&apos;t be able to access the project
            anymore.
          </p>
        </div>

        {/* leave button */}
        <div className="flex justify-end">
          <Button name="Cancel" onClick={onClick} style="secondary" />
          <Button name="Leave" onClick={handleLeaveProject} />
        </div>
      </Modal>
    </div>
  );
};

export default LeaveProjectModal;
