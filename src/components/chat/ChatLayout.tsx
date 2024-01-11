// src/components/chat/ChatLayout.tsx
import React, { useState } from 'react';
import ChatItem, { UserProfile } from './ChatItem';
import ChatHeader from './ChatHeader';

interface ChatLayoutProps {
  chatList: {
    chat_id: bigint;
    user_chat_user1_idTouser?: UserProfile | undefined;
    user_chat_user2_idTouser?: UserProfile | undefined;
  }[];
  // Add any other props you might need for the message display section
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ chatList }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfileName, setSelectedProfileName] = useState<string | null>(null);

  const filteredChatList = chatList.filter((chat) =>
    chat.user_chat_user1_idTouser?.profile?.some((profile) =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Add a custom style for hover effect
  const chatRowStyle = {
    transition: 'background-color 0.3s ease-in-out',
    cursor: 'pointer',
  };

  return (
    <div className="flex h-full">
      {/* Left Pane Wrapper */}
      <div className="border-r border-gray-300 w-1/4">
        <div className="h-full overflow-y-auto">
          {/* Your ChatLayout content */}
          {/* Search Bar */}
          <div className="p-4">
            <input
              type="text"
              placeholder="Search profiles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>

        {/* Profiles */}
        <div className="flex flex-col pl-4">
          {filteredChatList.map((chat, index) => (
            <div
              key={chat.chat_id}
              className="transition duration-300 ease-in-out"
              style={chatRowStyle}  // Apply the custom style here
              onClick={() => setSelectedProfileName(chat.user_chat_user1_idTouser?.name || '')}
            >
              <ChatItem chat={chat} />
              {/* Add a line separator between ChatItems */}
              {index < filteredChatList.length - 1 && (
                <hr className="my-4 border-r border-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>

      {/* Message Section */}
      <div className="flex-1 pl-4">
        {/* {selectedProfileName && <ChatHeader profileName={selectedProfileName} />} */}
        {/* Add your message section content here */}
      </div>
    </div>
  );
};

export default ChatLayout;
