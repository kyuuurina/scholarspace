import React, { useState } from "react";
import TestPostModal from "./AddNewPostModal"; // Import your modal component

const AddNewPostButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={openModal} className="rounded-lg bg-purple-accent-1 px-3 py-2 text-center text-sm font-medium text-white hover:bg-purple-accent-2 focus:outline-none">
        Add New Post
      </button>
      <TestPostModal openModal={isModalOpen} onClick={closeModal} />
    </div>
  );
};

export default AddNewPostButton;