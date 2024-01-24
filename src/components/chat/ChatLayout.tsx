// src/components/chat/ChatLayout.tsx
import React, { useState, useEffect, ReactNode } from 'react';
import ChatItem, { UserProfile } from './ChatItem';
import ChatHeader from './ChatHeader';
import { useFetchChatMessages } from '~/utils/chatmessage';
import Message from './Message'; // Updated import
import { useUser } from '@supabase/auth-helpers-react';
import { MoonLoader } from 'react-spinners';

import { useForm } from "react-hook-form";
import MessageInputSection, { FormValues as MessageFormValues } from './MessageInput';
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodType } from "zod";
import EmptyState from './EmptyState';

import { useQuery } from "@tanstack/react-query";
import { api } from "~/utils/api";
import { useRouter } from 'next/router'

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
  refetch: () => void;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ chatList, selectedChatId, onChatSelect, children, chatMessages: propChatMessages, refetch }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const QueryKey = ["getChatMessages", selectedChatId];
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

  // Fetch messages
  const messagesQuery = api.chat.getChatMessages.useQuery(
    { chat_id: (chatList[0]?.chat_id || 0) },
    { enabled: !!chatList[0]?.chat_id }
  );

  const { data: updatedMessage, refetch: refetchMessage } = useQuery(
    QueryKey,
    { enabled: false } // Disable automatic fetching on mount
  );

  // send a new message
  const sendMessageMutation = api.chat.sendMessage.useMutation({
    onSuccess: async () => {
      // When the sendMessageMutation is successful, refetch the messages
      await messagesQuery.refetch();
      router.reload();
    },
  });

  const handleSendMessage = async (formData: MessageFormValues) => {
    try {
      await sendMessageMutation.mutateAsync({
        chat_id: selectedChatId || 0,
        content: formData.content,
      });
      reset();
      refetch();
      await refetchMessage(); // Trigger the refetch for the sent message
      await messagesQuery.refetch();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    // Update selectedProfileName when selecting a chat
    if (selectedChatId) {
      const selectedChat = chatList.find((chat) => chat.chat_id === selectedChatId);

      if (selectedChat) {
        const isUser1 = user?.id === selectedChat.user_chat_user1_idTouser?.id;
        const isUser2 = user?.id === selectedChat.user_chat_user2_idTouser?.id;

        if (isUser1 && user?.id !== selectedChat.user_chat_user2_idTouser?.id) {
          setSelectedProfileName(selectedChat.user_chat_user1_idTouser?.name || '');
        } else if (isUser2 && user?.id !== selectedChat.user_chat_user1_idTouser?.id) {
          setSelectedProfileName(selectedChat.user_chat_user2_idTouser?.name || '');
        }
      }
    }
  }, [selectedChatId, chatList, user]);

  // Use propChatMessages when selectedChatId is null
  const messagesToDisplay = selectedChatId === null ? propChatMessages : chatMessages;

  return (
    <div className="flex h-full">
      {/* Left Pane Wrapper */}
      <div className="border-r border-gray-300 w-1/4">
        <div className="h-full overflow-y-auto flex flex-col">
          <div className="p-4">
            <input
              type="text"
              placeholder="Search profiles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
  
          <div className="flex flex-col flex-1 pl-4">
            <div className="overflow-y-auto">
              {/* Wrapper for ChatItem to make it scrollable independently */}
              {filteredChatList.map((chat, index) => (
                <div
                  key={chat.chat_id}
                  className="transition duration-300 ease-in-out"
                  style={chatRowStyle}
                  onClick={() => {
                    setSelectedProfileName(chat.user_chat_user1_idTouser?.name || '');
                    onChatSelect(chat.chat_id);
                  }}
                >
                  <ChatItem
                    chat={chat}
                    isSelected={selectedChatId === chat.chat_id}
                    onClick={() => {
                      setSelectedProfileName(chat.user_chat_user1_idTouser?.name || '');
                      onChatSelect(chat.chat_id);
                    }}
                  />
                  {index < filteredChatList.length - 1 && <hr className="my-4 border-r border-gray-300" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  
      {/* Message Section */}
      <div className="flex-1 pl-4 flex flex-col relative">
        {isLoadingChatMessages && (
          <div className="flex items-center justify-center">
            <MoonLoader color={"#ffff"} loading={true} size={20} />
          </div>
        )}
  
        {selectedChatId ? (
          <div className="flex-1 overflow-y-auto messages-container">
            {/* Display chatMessages here */}
            {messagesToDisplay.map((message) => (
              <Message
                key={message.message_id}
                isCurrentUser={message.sender_id === user?.id}
                content={message.content}
                timestamp={message.timestamp}
                chat_id={Number(message.chat_id) || 0}
                // refetch={async () => {
                //   await messagesQuery.refetch();
                refetch={async () => {
                  await refetchMessage();
                }}
              />
            ))}
          </div>
        ) : (
          // <div className="flex-1 flex items-center justify-center">
          <EmptyState />
          // </div>
        )}

        {/* Input Section */}
        <div className="message-input-container sticky bottom-0 bg-white p-4">
          <MessageInputSection
            chatId={selectedChatId || 0}
            onMessageSubmit={handleSendMessage}
                // refetch={async () => {
                //   await messagesQuery.refetch();
            refetch={async () => {
                  await refetchMessage();
                }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
