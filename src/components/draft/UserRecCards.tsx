import React from "react";
import Image from "next/image";

interface UserProfile {
  id: number;
  name: string;
}

interface UserProfileCardProps {
  users: UserProfile[];
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ users }) => {
  const displayedUsers = users.slice(0, 10);

  return (
    <div className="p-4">
      <div className="bg-white shadow-md p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">People you may know...</h2>
        <ul>
          {displayedUsers.map((user, index) => (
            <li
              key={user.id}
              className={`flex items-center ${
                index !== displayedUsers.length - 1 ? "mb-4" : ""
              }`}
            >
              <div className="w-12 h-12 mr-4">
                <Image
                  src={`/url/to/avatar-image-for-${user.id}.jpg`} // Replace with the actual image path
                  alt={`${user.name}'s avatar`}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              </div>
              <span className="text-base font-medium">{user.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserProfileCard;
