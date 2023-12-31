import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditExperience from "./EditExperience";
import { api } from "~/utils/api";
import SuccessToast from "../toast/SuccessToast";
import ErrorToast from "../toast/ErrorToast";
import toast from "react-hot-toast";
import Router from "next/router";
import ConfirmationDialog from "../ConfirmationDialog";

type ExperienceCardProps = {
  experience: {
    experience_id: string;
    title: string;
    start_year: string;
    end_year: string;
    description: string | null;
  };
  isLastItem?: boolean; // New prop to indicate if it's the last item
};

const EducationCard: React.FC<ExperienceCardProps> = ({ experience, isLastItem = false }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); // New state for the confirmation dialog

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  // handleDelete
  const deleteExperience = api.experience.deleteExperience.useMutation({
    onSuccess: () => {
      toast.custom(() => <SuccessToast message="Experience successfully deleted" />);
    },
  });

  const handleDeleteExperience = () => {
    setIsConfirmationOpen(true); // Show confirmation dialog
  };

  const confirmDelete = async () => {
    try {
      await deleteExperience.mutateAsync({
        experience_id: experience.experience_id,
      });
      Router.reload();
    } catch (error) {
      console.error("Failed to delete education:", error);
      toast.custom(() => <ErrorToast message="Failed to delete Experience" />);
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
          {`${experience.start_year} - ${experience.end_year}`}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">title:</span> {experience.title}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Description:</span>{" "}
          {experience.description || "No description available"}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-4">
        {/* Edit button */}
        <button onClick={handleEditClick} className="text-blue-500 hover:underline">
          Edit <FaEdit className="inline ml-1" />
        </button>

        {/* Delete button */}
        <button onClick={handleDeleteExperience} className="text-red-500 hover:underline">
          Delete <FaTrash className="inline ml-1" />
        </button>
      </div>

      {/* Edit Achievement Modal */}
      {isEditModalOpen && (
        <EditExperience
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