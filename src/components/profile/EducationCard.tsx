import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditEducation from "./EditEducation";
import { api } from "~/utils/api";
import SuccessToast from "../toast/SuccessToast";
import ErrorToast from "../toast/ErrorToast";
import toast from "react-hot-toast";
import Router from "next/router";
import ConfirmationDialog from "../ConfirmationDialog";

// Auth
import { getCookie } from "cookies-next";

// Utils
import { UseCheckProfile } from "~/utils/profile";

type EducationCardProps = {
  education: {
    education_id: string;
    school: string;
    start_year: string;
    end_year: string;
    description: string | null;
    user_id: string;
    isLoading: boolean;
  };
  isLastItem?: boolean; // New prop to indicate if it's the last item
};

const EducationCard: React.FC<EducationCardProps> = ({ education, isLastItem = false }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); // New state for the confirmation dialog

  const userId = getCookie("UserID") as string;
  const { user } = UseCheckProfile(userId);

  const isOwner = user && user.id === education.user_id;

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  // handleDelete
  const deleteEducation = api.education.deleteEducation.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Education successfully deleted" />);
    },
  });

  const handleDeleteEducation = () => {
    setIsConfirmationOpen(true); // Show confirmation dialog
  };

  const confirmDelete = async () => {
    try {
      await deleteEducation.mutateAsync({
        education_id: education.education_id,
      });
      Router.reload();
    } catch (error) {
      console.error("Failed to delete education:", error);
      toast.custom(() => <ErrorToast message="Failed to delete education" />);
    } finally {
      setIsConfirmationOpen(false); // Close confirmation dialog
    }
  };

  const cancelDelete = () => {
    setIsConfirmationOpen(false); // Close confirmation dialog
  };

  return (
    <div className={`flex justify-between items-center mb-4 ${isLastItem ? "" : "border-b border-gray-300 pb-4"}`}>
      <div>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Year:</span>{" "}
          {`${education.start_year} - ${education.end_year}`}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Institution:</span> {education.school}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Description:</span>{" "}
          {education.description || "No description available"}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-4">
        {/* Edit button */}
        {isOwner && (
        <button onClick={handleEditClick} className="text-blue-500 hover:underline">
          Edit <FaEdit className="inline ml-1" />
        </button>
        )}

        {/* Delete button */}
        {isOwner && (
        <button onClick={handleDeleteEducation} className="text-red-500 hover:underline">
          Delete <FaTrash className="inline ml-1" />
        </button>
        )}
      </div>

      {/* Edit Achievement Modal */}
      {isEditModalOpen && (
        <EditEducation
        education = {education}
          openModal={isEditModalOpen}
          onClick={() => setIsEditModalOpen(false)}
        />
      )}

      {/* Confirmation Dialog */}
      {isConfirmationOpen && (
        <ConfirmationDialog
          isOpen={isConfirmationOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default EducationCard;
