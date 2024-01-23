// src/pages/chat/message/[id].tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '~/pages/_app';
import Head from '~/components/layout/Head';
import Layout from '~/components/layout/Layout';
import { useUser } from '@supabase/auth-helpers-react';
import { useFetchChatMessages } from '~/utils/chatmessage';
import { useFetchChatList } from '~/utils/chatmessage';
import ChatLayout from '~/components/chat/ChatLayout';
import {api} from "~/utils/api";


const ChatMessagePage: NextPageWithLayout = () => {

  const user = useUser();
  const userId = user?.id ?? '';
  const router = useRouter();
  const { id } = router.query;
  const { chatList, isLoadingChatList, errorChatList } = useFetchChatList(userId);
  const chatId = typeof id === 'string' ? parseInt(id, 10) : null;

  // Fetch messages
  const messagesQuery = api.chat.getChatMessages.useQuery(
    { chat_id: (chatList[0]?.chat_id || 0) },
    { enabled: !!chatList[0]?.chat_id }
  );

  // Ensure chatId is never null, provide a default value of 0
  const { chatMessages, isLoadingChatMessages, errorChatMessages } = useFetchChatMessages(chatId || 0);

    // Add state to track the selected chat
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

    const handleChatSelect = async (chatId: number) => {
      try {
        // Update the selectedChatId state
        setSelectedChatId(chatId);
        await router.push(`/chat/message/${chatId}`);
      } catch (error) {
        console.error('Error navigating to chat message:', error);
      }
    };

  return (
    // <ChatLayout
    //   chatList={[]} // Empty chatList as no need to display it in message view
    //   selectedChatId={chatId}
    // //   onChatSelect={() => {}}
    //   chatMessages={chatMessages}
    // //   isLoadingChatMessages={isLoadingChatMessages}
    // //   errorChatMessages={errorChatMessages}
    // >

    <ChatLayout
    chatList={chatList}
    onChatSelect={handleChatSelect}
    selectedChatId={selectedChatId}
    chatMessages={[]}
    refetch={async () => {
      await messagesQuery.refetch();
    }}

    >
      {/* Conditionally render an error message when chatId is null */}
      {!chatId && <p>Error in fetching messages.</p>}
    </ChatLayout>
  );
};

ChatMessagePage.getLayout = function getLayout(page: ReactElement) {
    return (
      <>
        <Layout>{page}</Layout>
      </>
    );
  };

export default ChatMessagePage;
