// src/components/chat/ChatHeader.tsx
import React from 'react';

interface ChatHeaderProps {
  profileName: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ profileName }) => {
  return (
    <div className="bg-gray-100 p-4 border-b border-gray-300">
      <h2 className="text-lg font-bold">{profileName}</h2>
    </div>
  );
};

export default ChatHeader;
