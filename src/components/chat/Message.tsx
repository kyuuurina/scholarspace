// src/components/chat/Message.tsx
import React, { useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { useFetchChatMessages } from '~/utils/chatmessage';
import { api } from '~/utils/api';

interface MessageProps {
  isCurrentUser: boolean;
  content: string | null;
  timestamp: Date;
  chat_id: number;
  refetch: () => void;
}

const Message: React.FC<MessageProps> = ({
  isCurrentUser,
  content,
  timestamp,
  chat_id,
  refetch,
}) => {
  const { chatMessages, isLoadingChatMessages, errorChatMessages } = useFetchChatMessages(chat_id);
  const user = useUser();

  React.useEffect(() => {
    refetch();
  }, []);

  const messageStyle = isCurrentUser ? 'bg-dark-purple text-white' : 'bg-gray-300 text-black';
  const contentColor = isCurrentUser ? 'text-white' : 'text-black';
  const timestampColor = isCurrentUser ? 'text-white' : 'text-gray-500';
  const alignStyle = isCurrentUser ? 'flex justify-end' : 'flex justify-start';

  return (
    <div className={`p-2 rounded-md my-2 ${alignStyle}`}>
      <div className={`p-3 rounded-md ${messageStyle}`}>
        <div className={`mb-2 ${contentColor}`}>{content}</div>
        <div className={`text-xs ${timestampColor}`}>{timestamp.toLocaleString()}</div>
      </div>
    </div>
  );
};

export default Message;
