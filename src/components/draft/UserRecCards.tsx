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
  return (
    <div className="p-4">
      <div className="bg-white shadow-md p-4 w-64">
        <h2 className="text-lg font-semibold">People you may know...</h2>
        <ul>
          {users.map((user, index) => (
            <li
              key={user.id}
              className={`flex items-center ${
                index !== users.length - 1 ? "mb-4" : ""
              }`}
            >
              <div className="w-10 h-10 mr-4">
                <Image
                  src={`/url/to/avatar-image-for-${user.id}.jpg`} // Replace with the actual image path
                  alt={`${user.name}'s avatar`}
                  width={40}
                  height={40}
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
