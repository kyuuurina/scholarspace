// src/components/chat/ChatItem.tsx
import React from 'react';
import Link from 'next/link';
import AvatarPlaceholder from '../avatar/AvatarPlaceholder';

interface Profile {
  profile_id: string;
  name: string;
  avatar_url: string | null;
}

export interface UserProfile {
  id: string;
  name?: string | null;
  avatar_url?: string | null;
  profile?: Profile[];
}

interface ChatItemProps {
  chat: {
    chat_id: bigint;
    user_chat_user1_idTouser?: UserProfile | undefined;
    user_chat_user2_idTouser?: UserProfile | undefined;
  };
}

const ChatItem: React.FC<ChatItemProps> = ({ chat }) => {
  if (!chat || !chat.user_chat_user1_idTouser) {
    console.error('Invalid chat data:', chat);
    return null;
  }

  const user1 = chat.user_chat_user1_idTouser;

  return (
    <div className="hover:bg-gray-100 transition duration-300 ease-in-out"> {/* Add this div with the "flex items-center" classes */}
      {/* <p>Chat ID: {chat.chat_id.toString()}</p> */}

      {user1 && (
        <div className="flex items-center"> {/* Add this div with the "flex items-center" classes */}
          {/* <p>User 1: </p> */}
          <div>
            {user1.profile && user1.profile.map(profile => (
              <div key={profile.profile_id} className="flex items-center mb-2"> {/* Add this div with the "flex items-center mb-2" classes */}
                <Link href={`/manage-profile/${profile.profile_id}`}>
                  <div className="aspect:square h-10 w-10 cursor-pointer">
                    <AvatarPlaceholder name={profile.name} shape="circle" />
                  </div>
                </Link>
                <div className="ml-2 font-bold"> {/* Add this div with the "ml-2 font-bold" classes */}
                  <Link href={`/manage-profile/${profile.profile_id}`}>
                    <span className="cursor-pointer inline-block max-w-full sm:max-w-[150px] overflow-hidden whitespace-nowrap overflow-ellipsis">
                      {profile.name}
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
