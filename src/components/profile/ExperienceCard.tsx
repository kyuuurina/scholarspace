import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditExperience from "./EditExperience";
import { api } from "~/utils/api";
import SuccessToast from "../toast/SuccessToast";
import ErrorToast from "../toast/ErrorToast";
import toast from "react-hot-toast";
import Router from "next/router";
import ConfirmationDialog from "../ConfirmationDialog";

// Auth
import { useUser } from "@supabase/auth-helpers-react";

// Utils
import { UseCheckProfile } from "~/utils/profile";

type ExperienceCardProps = {
  experience: {
    experience_id: string;
    title: string;
    start_year: string;
    end_year: string;
    description: string | null;
    user_id: string;
    isLoading: boolean;
  };
  isLastItem?: boolean; // New prop to indicate if it's the last item
};

const EducationCard: React.FC<ExperienceCardProps> = ({
  experience,
  isLastItem = false,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); // New state for the confirmation dialog

  const user = useUser();
  const userId = user?.id || "";

  const isOwner = user && user.id === experience.user_id;

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  // handleDelete
  const deleteExperience = api.experience.deleteExperience.useMutation({
    onSuccess: () => {
      toast.custom(() => (
        <SuccessToast message="Experience successfully deleted" />
      ));
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
    <div
      className={`mb-4 flex items-center justify-between ${
        isLastItem ? "" : "border-b border-gray-300 pb-4"
      }`}
    >
      <div>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Year:</span>{" "}
          {`${experience.start_year} - ${experience.end_year}`}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Research Title:</span>{" "}
          {experience.title}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Description:</span>{" "}
          {experience.description || "No description available"}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-4">
        {/* Edit button */}
        {isOwner && (
          <button
            onClick={handleEditClick}
            className="text-blue-500 hover:underline"
          >
            Edit <FaEdit className="ml-1 inline" />
          </button>
        )}

        {/* Delete button */}
        {isOwner && (
          <button
            onClick={handleDeleteExperience}
            className="text-red-500 hover:underline"
          >
            Delete <FaTrash className="ml-1 inline" />
          </button>
        )}
      </div>

      {/* Edit Achievement Modal */}
      {isEditModalOpen && (
        <EditExperience
          experience={experience}
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
