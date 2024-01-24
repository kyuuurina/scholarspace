// MessageButton.tsx
import React, { useState, useEffect } from 'react';
import { useUser} from "@supabase/auth-helpers-react";
import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import { FiMessageSquare } from 'react-icons/fi';

interface MessageButtonProps {
  userId: string; // Other user's ID
  chatId?: number; // Existing chat ID (optional)
}

const MessageButton: React.FC<MessageButtonProps> = ({ userId, chatId }) => {
  const router = useRouter();
  const [existingChatId, setExistingChatId] = useState<number | null>(null);
  const user = useUser();

  const { data: existingChat, refetch: validateChatQuery } = api.chat.validateChat.useQuery({
    user2_id: userId,
  });

  const createChatMutation = api.chat.createChat.useMutation();

  useEffect(() => {
    const checkChat = async () => {
      try {
        // Check for an existing chat
        if (existingChat?.chat_id) {
          setExistingChatId(existingChat.chat_id);
        } else {
          // If no existing chat, create a new one
          const newChat = await createChatMutation.mutateAsync({
            user2_id: userId,
          }) as { chat_id: number; user1_id: string; user2_id: string; created_at: Date };
    
          setExistingChatId(
            (newChat as { data?: { chat_id: number } })?.data?.chat_id ||
            (newChat as { chat_id: number })?.chat_id ||
            null
          );
        }
      } catch (error) {
        console.error('Error checking or creating chat:', error);
      }
    };
  
    // Call the async function and handle the promise
    checkChat().catch((error) => {
      console.error('Error in checkChat:', error);
    });
  }, [userId, existingChat]);

  const handleButtonClick = () => {
    if (existingChatId) {
      router.push(`/chat/message/${existingChatId}`).catch((error) => {
        console.error('Error navigating to chat page:', error);
      });
    }
  };

  return (
    <button
      onClick={handleButtonClick}
      className="flex items-center bg-white text-purple-800 border border-purple-800 py-2 px-4 rounded"
    >
      <FiMessageSquare className="mr-2" /> Message
    </button>
  );
};

export default MessageButton;
