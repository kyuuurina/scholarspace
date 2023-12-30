import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-md shadow-md">
        <div className="flex items-center mb-4">
          <FiAlertTriangle className="text-red-500 mr-2" size={24} />
          <p className="text-xl font-semibold">Confirm Delete?</p>
        </div>
        <div className="flex justify-end">
          <button
            className="mr-2 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
            onClick={onConfirm}
          >
            Confirm Delete
          </button>
          <button
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
