// src/components/chat/MessageInputSection.tsx
import React from 'react';
import PrimaryButton from '../button/PrimaryButton';
import { useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '~/utils/api';
import { useRouter } from 'next/router';

interface MessageInputSectionProps {
  chatId: number;
  onMessageSubmit: (formData: FormValues) => void;
  refetch: () => void;
}

export type FormValues = { content: string };

const MessageInputSection: React.FC<MessageInputSectionProps> = ({ chatId, onMessageSubmit, refetch }) => {

  const router = useRouter();
  // Zod schema for form validation
  const schema: ZodType<FormValues> = z.object({
    content: z.string(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  // Fetch messages
  const messagesQuery = api.chat.getChatMessages.useQuery(
    { chat_id: chatId },
    { enabled: !!chatId }
  );

  // send a new message
  const sendMessageMutation = api.chat.sendMessage.useMutation();

  const handleMessageSubmit = async (formData: FormValues) => {
    try {
      // Use mutateAsync for async operations
      await sendMessageMutation.mutateAsync({
        chat_id: chatId,
        content: formData.content,
      });
      reset();
      router.reload();
      refetch();
      await messagesQuery.refetch();
      onMessageSubmit(formData); // Call the onMessageSubmit prop here
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex items-center mt-2 sticky bottom-0 bg-white p-4">
      <form onSubmit={handleSubmit(handleMessageSubmit)} className="flex w-full">
        <input
          type="text"
          placeholder="Type a message..."
          {...register('content')}
          className="p-2 border border-gray-300 rounded w-full mr-2"
        />
        {errors.content && (
          <span className="text-red-500 text-sm">{errors.content.message}</span>
        )}
        <PrimaryButton
          name="Send"
          type="submit"
          isSubmitting={sendMessageMutation.isLoading}
          disabled={sendMessageMutation.isLoading}
        />
      </form>
    </div>
  );
};

export default MessageInputSection;
