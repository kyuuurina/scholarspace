// ConfirmationDialog.tsx
import React from 'react';

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
      <div className="bg-white p-4 rounded-md shadow-md">
        <p className="text-lg mb-4">Confirm Delete?</p>
        <div className="flex justify-end">
          <button className="mr-2 px-4 py-2 bg-red-500 text-white rounded-md" onClick={onConfirm}>
            Confirm Delete
          </button>
          <button className="px-4 py-2 bg-gray-300 rounded-md" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;


// import React from 'react';

// interface ConfirmationDialogProps {
//   title: string;
//   onConfirm: () => void;
//   onCancel: () => void;
// }

// const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ title, onConfirm, onCancel }) => {
//   return (
//     <div className="confirmation-dialog">
//       <p>{`Confirm Delete ${title}?`}</p>
//       <button onClick={onConfirm}>Confirm Delete</button>
//       <button onClick={onCancel}>Cancel</button>
//     </div>
//   );
// };

// export default ConfirmationDialog;
