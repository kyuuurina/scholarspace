// i want this file
import { useState } from "react";

type RoleData = {
  collabStatus: string;
};

type RoleFormProps = {
  updateFields: (fields: Partial<RoleData>) => void;
  setIsSelected: (isSelected: boolean) => void;
};

export function RoleForm({ updateFields, setIsSelected }: RoleFormProps) {
  const [selectedRole, setSelectedRole] = useState<string>(""); // State to keep track of the selected collabStatus

  const handleCardClick = (collabStatus: string) => {
    setSelectedRole(collabStatus);
    updateFields({ collabStatus }); // Update the collabStatus in the parent component when a card is selected
    setIsSelected(true);
  };

  return (
    <>
      <div className="my-6">
        <div className="flex space-y-3 sm:flex-col">
          <div
            className={`block max-w-sm rounded-lg border ${
              selectedRole === "researcher"
                ? "border-blue-500"
                : "border-gray-200"
            } cursor-pointer bg-white p-6 shadow ${
              selectedRole === "researcher"
                ? "bg-blue-50"
                : "hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            }`}
            onClick={() => handleCardClick("researcher")}
          >
            <h1 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              I&rsquo;m a researcher
            </h1>
            <h2 className="text-lg font-medium text-gray-500 dark:text-white">
              Experienced Researchers
            </h2>
          </div>
          <div
            className={`block max-w-sm cursor-pointer rounded-lg border ${
              selectedRole === "student" ? "border-blue-500" : "border-gray-200"
            } bg-white p-6 shadow ${
              selectedRole === "student"
                ? "bg-blue-50"
                : "hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            }`}
            onClick={() => handleCardClick("student")}
          >
            <h1 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              I&rsquo;m a student
            </h1>
            <h2 className="text-lg font-medium text-gray-500 dark:text-white">
              Postgraduate Researchers
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}
