// src/components/chat/ChatLayout.tsx
import React, { useState, useEffect, ReactNode } from 'react';
import ChatItem, { UserProfile } from './ChatItem';
import ChatHeader from './ChatHeader';
import { useFetchChatMessages } from '~/utils/chatmessage';
import MessageInputSection from './MessageInput';
import Message from './Message'; // Updated import
import PrimaryButton from '../button/PrimaryButton';
import { useUser } from '@supabase/auth-helpers-react';

interface ChatMessageProps {
  message_id: bigint;
  chat_id: bigint | null;
  sender_id: string | null;
  content: string | null;
  timestamp: Date;
}

interface ChatLayoutProps {
  chatList: {
    chat_id: bigint;
    user_chat_user1_idTouser?: UserProfile | undefined;
    user_chat_user2_idTouser?: UserProfile | undefined;
  }[];
  onChatSelect: (chatId: number) => void;
  selectedChatId: number | null;
  children?: ReactNode;
  chatMessages: {
    user: {
      id: string;
      email: string;
    } | null;
    message_id: bigint;
    chat_id: bigint | null;
    sender_id: string | null;
    content: string | null;
    timestamp: Date;
  }[]; // Add chatMessages property
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ chatList, selectedChatId, onChatSelect, children, chatMessages: propChatMessages }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfileName, setSelectedProfileName] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');

  const user = useUser();
  // Use propChatMessages directly when selectedChatId is null
  const { chatMessages, isLoadingChatMessages, errorChatMessages } = useFetchChatMessages(selectedChatId || 0);

  const filteredChatList = chatList.filter((chat) =>
    chat.user_chat_user1_idTouser?.profile?.some((profile) =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const chatRowStyle = {
    transition: 'background-color 0.3s ease-in-out',
    cursor: 'pointer',
  };

  useEffect(() => {
    // Handle new chat selection, e.g., load messages for the selected chat
    if (selectedChatId) {
      // Fetch messages for the selected chat
      // The useFetchChatMessages hook already takes care of this, so no additional code needed here
    }
  }, [selectedChatId]);

  // Use propChatMessages when selectedChatId is null
  const messagesToDisplay = selectedChatId === null ? propChatMessages : chatMessages;
  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message);
    // Handle sending the message, e.g., call an API to send the message
  };

  return (
    <div className="flex h-full">
      {/* Left Pane Wrapper */}
      <div className="border-r border-gray-300 w-1/4">
        <div className="h-full overflow-y-auto">
          <div className="p-4">
            <input
              type="text"
              placeholder="Search profiles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>

          <div className="flex flex-col pl-4">
            {filteredChatList.map((chat, index) => (
              <div
                key={chat.chat_id}
                className="transition duration-300 ease-in-out"
                style={chatRowStyle}
                onClick={() => {
                  setSelectedProfileName(chat.user_chat_user1_idTouser?.name || '');
                  onChatSelect(Number(chat.chat_id));
                }}
              >
                <ChatItem chat={chat} />
                {index < filteredChatList.length - 1 && <hr className="my-4 border-r border-gray-300" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message Section */}
      <div className="flex-1 pl-4">


        {/* {selectedProfileName && (
          <div className="flex-1 flex flex-col">
            <ChatHeader profileName={selectedProfileName} /> */}

            <div className="flex-1 overflow-y-auto">
              {/* Display chatMessages here */}
              {messagesToDisplay.map((message) => (
                <Message
                  key={message.message_id}
                  isCurrentUser={message.sender_id === user?.id}
                  content={message.content}
                  timestamp={message.timestamp}
                />
              ))}

              {/* Input Section */}
              <MessageInputSection onSend={handleSendMessage} />
            </div>
          </div>
        {/* )} */}
      </div>
    // </div>
  );
};

export default ChatLayout;
