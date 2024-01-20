// src/components/chat/ChatItem.tsx
import React from 'react';
import Link from 'next/link';
import AvatarPlaceholder from '../avatar/AvatarPlaceholder';
import Image from 'next/image';
import { useUser } from '@supabase/auth-helpers-react';

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
  const currentUser = useUser();

  if (!chat || (!chat.user_chat_user1_idTouser && !chat.user_chat_user2_idTouser)) {
    console.error('Invalid chat data:', chat);
    return null;
  }

  // Determine the chat partner based on the current user's ID
  const chatPartnerProfile = currentUser?.id === chat.user_chat_user1_idTouser?.id
    ? chat.user_chat_user2_idTouser
    : currentUser?.id === chat.user_chat_user2_idTouser?.id
    ? chat.user_chat_user1_idTouser
    : null;

  return (
    <div className="hover:bg-gray-100 transition duration-300 ease-in-out">
      {chatPartnerProfile && (
        <div className="flex items-center">
          <div>
            {chatPartnerProfile.profile && chatPartnerProfile.profile.map(profile => (
              <div key={profile.profile_id} className="flex items-center mb-2">
                <Link href={`/manage-profile/${profile.profile_id}`}>
                  <div className="aspect:square h-10 w-10 cursor-pointer">
                    {profile.avatar_url ? (
                      <span className="relative inline-block cursor-pointer">
                        <div className="h-10 w-10">
                          <Image
                            src={`https://ighnwriityuokisyadjb.supabase.co/storage/v1/object/public/avatar/${profile.avatar_url}`}
                            alt={profile.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full"
                          />
                        </div>
                        <span className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-800 opacity-50 rounded-full" />
                      </span>
                    ) : (
                      <AvatarPlaceholder name={profile.name} shape="circle" />
                    )}
                  </div>
                </Link>
                <div className="ml-2 font-bold">
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