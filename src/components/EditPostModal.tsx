import React from "react";

interface EditPostModalProps {
  title: string;
  author: string;
  description: string;
  onClose: () => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
  title,
  author,
  description,
  onClose,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to handle form submission and update the post
    // You can make an API call or update the post locally
    console.log("Updated post:", title);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-lg font-bold mb-4">Edit Post</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="edit-title">Title:</label>
          <input
            type="text"
            id="edit-title"
            defaultValue={title}
            className="mb-2"
          />

          <label htmlFor="edit-author">Author:</label>
          <input
            type="text"
            id="edit-author"
            defaultValue={author}
            className="mb-2"
          />

          <label htmlFor="edit-description">Description:</label>
          <textarea
            id="edit-description"
            defaultValue={description}
            className="mb-2"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="mr-2 px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
