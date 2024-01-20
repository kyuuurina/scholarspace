// src/components/chat/MessageInputSection.tsx
import React, { useState } from 'react';
import PrimaryButton from '../button/PrimaryButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodType } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '~/utils/api';

interface MessageInputSectionProps {
  chatId: number;
  onMessageSubmit: (formData: MessageFormValues) => void;
  refetch: () => void;
}

export type MessageFormValues = { content: string };

const MessageInputSection: React.FC<MessageInputSectionProps> = ({ chatId, refetch }) => {
  // Zod schema for form validation
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
      { chat_id: chatId },
      { enabled: !! chatId }
  );
  
  const messages = messagesQuery.data || [];

  // Use the correct mutation function from the API
  const sendMessageMutation = api.chat.sendMessage.useMutation();

  const onSubmit = async (data: MessageFormValues) => {
    try {
      // Use mutateAsync for async operations
      await sendMessageMutation.mutateAsync({ chat_id: chatId, content: data.content });
      setMessageInput('');
      reset();
      refetch(); // Refetch data after sending a message
      await messagesQuery.refetch();
    } catch (error) {
      // Handle error if necessary
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex items-center mt-2 sticky bottom-0 bg-white p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <input
          type="text"
          placeholder="Type a message..."
          {...register('content')}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full mr-2"
        />
        {errors.content && (
          <span className="text-red-500 text-sm">{errors.content.message}</span>
        )}
        <PrimaryButton
          name="Send"
          type="submit"
          disabled={!messageInput.trim()}
        />
      </form>
    </div>
  );
};

export default MessageInputSection;
