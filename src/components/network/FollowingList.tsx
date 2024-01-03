import React, { useState } from "react";
import AvatarPlaceholder from "../avatar/AvatarPlaceholder";
import { useFetchFollowing } from "~/utils/follow";
import ScrollableModal from "./ScrollableModal";

const FollowingList: React.FC = () => {
  const { following, isLoading, error } = useFetchFollowing();
  const [isModalOpen, setModalOpen] = useState(false);

  console.log("mengikut", following);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading followers</div>;
  }

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <button
        onClick={openModal}
        className="rounded-full px-4 py-2 bg-purple-800 text-white hover:bg-purple-600 transition-colors duration-300"
      >
        Following
      </button>
      <ScrollableModal
        show={isModalOpen}
        onClose={closeModal}
        title="Followers"
      >
        {following.length === 0 ? (
          <p>No following account</p>
        ) : (
          <ul>
            {following.map((following) => (
              <li key={following.id} className="flex items-center space-x-2">
                <AvatarPlaceholder name={following.name || "Unknown"} shape="circle" />
                <span>{following.name || "Unknown"}</span>
              </li>
            ))}
          </ul>
        )}
      </ScrollableModal>
    </div>
  );
};

export default FollowingList;
