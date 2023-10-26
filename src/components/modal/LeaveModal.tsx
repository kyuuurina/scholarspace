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

const LeaveModal: React.FC<ModalProps> = ({
  openModal,
  onClick,
  name = "workspace",
  id,
}) => {
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);

  const { mutateAsync: leaveWorkspace } = api.workspace.leave.useMutation();

  const handleLeaveWorkspace = async () => {
    if (isLeaving) return;
    try {
      setIsLeaving(true);
      await leaveWorkspace({
        workspaceId: id,
      });
    } catch (error) {
      console.error("Error leaving workspace:", error);
      toast.custom(() => <ErrorToast message="Error leaving workspace" />);
    } finally {
      setIsLeaving(false);
      void router.push("/");
      toast.custom(() => <SuccessToast message="Successfully left" />);
    }
  };

  return (
    <div>
      <Modal
        show={openModal}
        onClose={() => {
          onClick();
        }}
        title={name ? `Leave ${name}` : "Leave Workspace"}
      >
        <div>
          <p className="text-md mb-2">
            Are you sure you want to leave{" "}
            <span className="font-bold">{name}</span>? All your contributions
            will remain, but you won&apos;t be able to access the workspace
            anymore.
          </p>
        </div>

        {/* leave button */}
        <div className="flex justify-end">
          <Button name="Cancel" onClick={onClick} style="secondary" />
          <Button name="Leave" onClick={handleLeaveWorkspace} />
        </div>
      </Modal>
    </div>
  );
};

export default LeaveModal;
