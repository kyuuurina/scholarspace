import React from "react";

type AvatarPlaceholderProps = {
  name: string;
  shape?: "circle" | "square";
};

const AvatarPlaceholder: React.FC<AvatarPlaceholderProps> = ({
  name,
  shape = "circle",
}) => {
  const placeholder = name.substring(0, 2).toUpperCase();

  return (
    <div
      className={`relative inline-flex h-full w-full items-center justify-center overflow-hidden bg-blue-300 dark:bg-gray-600 ${
        shape === "circle" ? "rounded-full" : "rounded-md"
      }`}
    >
      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {placeholder}
      </span>
    </div>
  );
};

export default AvatarPlaceholder;
