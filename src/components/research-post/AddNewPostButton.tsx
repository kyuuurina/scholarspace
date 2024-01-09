import React, { useState } from "react";
import TestPostModal from "./AddNewPostModal"; // Import your modal component

//routing
import Router from "next/router";
import { useRouter } from "next/router";

// Auth
import { getCookie } from "cookies-next";

// Utils
import { UseCheckProfile } from "~/utils/profile";
import { useRouterId } from "~/utils/routerId";
import {api} from "~/utils/api";

interface AddNewPostButtonProps {
  className?: string;
}

const AddNewPostButton: React.FC<AddNewPostButtonProps> = ({ className }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const { id }  = router.query; // query id

  const profileId = useRouterId();

  // get user profile
  const Profile = api.profile.get.useQuery({
    profile_id: profileId, // pass the id to router.query
  });

  //check id is owner
  const userId = getCookie("UserID") as string;
  const { user } = UseCheckProfile(userId);
  const isOwner = user && user.id === Profile.data?.user_id;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
    {isOwner && (
      <button
        onClick={openModal}
        className={`rounded-lg bg-purple-accent-1 px-3 py-2 text-center text-sm font-medium text-white hover:bg-purple-accent-2 focus:outline-none ${className || ''}`}
      >
        Add New Post
      </button>
    )}
      <TestPostModal openModal={isModalOpen} onClick={closeModal} />
    </div>
  );
};

export default AddNewPostButton;
