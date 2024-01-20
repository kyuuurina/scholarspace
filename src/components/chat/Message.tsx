// src/components/chat/Message.tsx
import React from 'react';
import { useUser } from '@supabase/auth-helpers-react';

interface MessageProps {
  isCurrentUser: boolean;
  content: string | null;
  timestamp: Date;
}

const Message: React.FC<MessageProps> = ({ isCurrentUser, content, timestamp }) => {
    const messageStyle = isCurrentUser ? 'bg-purple-800 text-white' : 'bg-gray-300 text-black';
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
