import React from "react";
import Image from 'next/image';

type ProfileAvatarProps = {
  name: string;
  shape?: "circle" | "square";
  avatar_url?: string; // Added avatar_url prop
};

const ProfileAvatarPlaceholder: React.FC<ProfileAvatarProps> = ({
  name,
  shape = "circle",
  avatar_url,
}) => {
  const placeholder = name.substring(0, 2).toUpperCase();

  return (
    <div
      className={`relative inline-flex h-full w-full items-center justify-center overflow-hidden bg-blue-300 dark:bg-gray-600 ${
        shape === "circle" ? "rounded-full" : "rounded-md"
      }`}
    >
      {avatar_url ? (
        <Image
          src={avatar_url}
          alt={`Avatar for ${name}`}
          width={100} // Set the width and height according to your design
          height={100}
          className="object-cover rounded-full"
        />
      ) : (
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {placeholder}
        </span>
      )}
    </div>
  );
};

export default ProfileAvatarPlaceholder;
