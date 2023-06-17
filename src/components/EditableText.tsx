import { useState, useRef, useEffect } from "react";

interface EditableTextProps {
  text: string;
  onUpdate: (text: string) => void;
  multiline?: boolean;
}

const EditableText: React.FC<EditableTextProps> = ({
  text,
  onUpdate,
  multiline,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text || "");
  const [isEmpty, setIsEmpty] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const handleTextClick = () => {
    setIsEditing(true);
  };

  const handleTextBlur = () => {
    setIsEditing(false);
    if (editedText.trim() !== "") {
      onUpdate(editedText);
      setIsEmpty(false);
    } else {
      setIsEmpty(true);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditedText(event.target.value);
  };

  const handleInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div className="relative w-full">
      {isEditing ? (
        multiline ? (
          <textarea
            ref={inputRef as React.Ref<HTMLTextAreaElement>}
            value={editedText}
            onChange={handleInputChange}
            onBlur={handleTextBlur}
            onKeyDown={handleInputKeyDown}
            rows={4}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          />
        ) : (
          <input
            ref={inputRef as React.Ref<HTMLInputElement>}
            type="text"
            value={editedText}
            onChange={handleInputChange}
            onBlur={handleTextBlur}
            onKeyDown={handleInputKeyDown}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        )
      ) : (
        <span onClick={handleTextClick} className="cursor-pointer">
          {text}
        </span>
      )}
      {isEmpty && showAlert && (
        <div
          className="fixed left-1/2 top-10 z-50 -translate-x-1/2 transform rounded-lg bg-red-50 p-4 text-sm text-red-800 transition-all duration-300 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <span className="font-medium">Invalid input</span> Please enter a
          valid {multiline ? "Workspace description" : "Workspace name"}.
        </div>
      )}
    </div>
  );
};

export default EditableText;
