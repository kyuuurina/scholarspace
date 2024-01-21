// src/components/chat/ChatLayout.tsx
import React, { useState, useEffect, ReactNode } from 'react';
import ChatItem, { UserProfile } from './ChatItem';
import ChatHeader from './ChatHeader';
import { useFetchChatMessages } from '~/utils/chatmessage';
import Message from './Message'; // Updated import
import { useUser } from '@supabase/auth-helpers-react';

import { useForm } from "react-hook-form";
import MessageInputSection, {FormValues as MessageFormValues} from './MessageInput';
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodType } from "zod";

import { useQuery } from "@tanstack/react-query";
import {api} from "~/utils/api";

interface ChatMessageProps {
  message_id: number;
  chat_id: number | null;
  sender_id: string | null;
  content: string | null;
  timestamp: Date;
}

interface ChatLayoutProps {
  chatList: {
    chat_id: number;
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
    message_id: number;
    chat_id: number | null;
    sender_id: string | null;
    content: string | null;
    timestamp: Date;
  }[];
  refetch:() => void;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ chatList, selectedChatId, onChatSelect, children, chatMessages: propChatMessages, refetch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfileName, setSelectedProfileName] = useState<string | null>(null);

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

  const schema: ZodType<MessageFormValues> = z.object({
    content: z.string().min(3, { message: 'Comment is too short' }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageFormValues>({
    resolver: zodResolver(schema),
  });

  const [messageInput, setMessageInput] = useState('');

  // Fetch messages
  const messagesQuery = api.chat.getChatMessages.useQuery(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    { chat_id: selectedChatId?.chat_id || 0},
    { enabled: !!selectedChatId?.chat_id }
  );

  const messages = messagesQuery.data || [];

  // send a new message
  const sendMessageMutation = api.chat.sendMessage.useMutation();

  const handleSendMessage = async (formData: MessageFormValues) => {
    try {
      await sendMessageMutation.mutateAsync({
        chat_id: selectedChatId || 0,
        content: formData.content
      });
      reset();
      refetch();
      await messagesQuery.refetch();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    if (selectedChatId) {
    }
  }, [selectedChatId]);

  // Use propChatMessages when selectedChatId is null
  const messagesToDisplay = selectedChatId === null ? propChatMessages : chatMessages;


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
                  onChatSelect(chat.chat_id);
                  // onChatSelect(Number(chat.chat_id));
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
                  chat_id={Number(message.chat_id) || 0}
                  refetch={async () => {
                    await messagesQuery.refetch();
                  }}
                />
              ))}

              {/* Input Section */}
              <MessageInputSection
                chatId={selectedChatId || 0}
                onMessageSubmit={handleSendMessage}
                refetch={async () => {
                  await messagesQuery.refetch();
                }}
              />
            </div>
          </div>
        {/* )} */}
      </div>
    // </div>
  );
};

export default ChatLayout;
