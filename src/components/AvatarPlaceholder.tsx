import React from "react";

type AvatarPlaceholderProps = {
  name: string;
};

export const AvatarPlaceholder: React.FC<AvatarPlaceholderProps> = ({
  name,
}) => {
  const placeholder = name.substring(0, 2).toUpperCase();

  return (
    <div className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {placeholder}
      </span>
    </div>
  );
};
