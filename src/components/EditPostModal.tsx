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
      <div className="bg-white rounded-lg p-8 w-96">
        <h2 className="text-lg font-bold mb-4">Edit Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700">
              Title:
            </label>
            <input
              type="text"
              id="edit-title"
              defaultValue={title}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="edit-author" className="block text-sm font-medium text-gray-700">
              Author:
            </label>
            <input
              type="text"
              id="edit-author"
              defaultValue={author}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">
              Description:
            </label>
            <textarea
              id="edit-description"
              defaultValue={description}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              rows={4}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2"
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
