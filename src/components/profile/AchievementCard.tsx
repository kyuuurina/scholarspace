import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditAchievement from "./EditAchievement";
import { api } from "~/utils/api";
import SuccessToast from "../toast/SuccessToast";
import ErrorToast from "../toast/ErrorToast";
import toast from "react-hot-toast";
import Router from "next/router";
import ConfirmationDialog from "../ConfirmationDialog";
import { useUser } from "@supabase/auth-helpers-react";

// Utils
import { UseCheckProfile } from "~/utils/profile";

type AchievementCardProps = {
  achievement: {
    achievement_id: string;
    title: string;
    received_year: string;
    description: string | null;
    user_id: string;
    isLoading: boolean;
  };
  isLastItem?: boolean;
};

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  isLastItem = false,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); // New state for confirmation dialog

  const user = useUser();
  const userId = user?.id || "";

  const isOwner = user && userId === achievement.user_id;

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  //handleDelete
  const deleteAchievement = api.achievement.deleteAchievement.useMutation({
    onSuccess: () => {
      toast.custom(() => (
        <SuccessToast message="Achievement successfully deleted" />
      ));
    },
  });

  const handleDeleteAchievement = (achievement_id: string) => {
    setIsConfirmationOpen(true); // Show confirmation dialog
  };

  const confirmDelete = async () => {
    try {
      await deleteAchievement.mutateAsync({
        achievement_id: achievement.achievement_id,
      });
      Router.reload();
    } catch (error) {
      console.error("Failed to delete achievement:", error);
      toast.custom(() => <ErrorToast message="Failed to delete achievement" />);
    } finally {
      setIsConfirmationOpen(false); // Close confirmation dialog
    }
  };

  const cancelDelete = () => {
    setIsConfirmationOpen(false); // Close confirmation dialog
  };

  return (
    <div
      className={`mb-4 ${isLastItem ? "" : "border-b border-gray-300 pb-4"}`}
    >
      {achievement ? ( // Check if there is an achievement
        <div className="flex items-center justify-between">
          {/* Achievement details */}
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Year:</span>{" "}
              {achievement.received_year}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Title:</span> {achievement.title}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Description:</span>{" "}
              {achievement.description || "No description available"}
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
                onClick={() =>
                  handleDeleteAchievement(achievement.achievement_id)
                }
                className="text-red-500 hover:underline"
              >
                Delete <FaTrash className="ml-1 inline" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <p>No achievement record</p>
      )}

      {/* Edit Achievement Modal */}
      {isEditModalOpen && (
        <EditAchievement
          achievement={achievement}
          openModal={isEditModalOpen}
          onClick={() => setIsEditModalOpen(false)}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isConfirmationOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default AchievementCard;
