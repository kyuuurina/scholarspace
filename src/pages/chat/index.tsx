// src/pages/chat/index.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '~/pages/_app';
import Head from '~/components/layout/Head';
import Layout from '~/components/layout/Layout';
import ChatLayout from '~/components/chat/ChatLayout';
import { useUser } from '@supabase/auth-helpers-react';
import { useFetchChatList } from '~/utils/chatmessage';
import {api} from "~/utils/api";

const ChatPage: NextPageWithLayout = () => {
  const user = useUser();
  const userId = user?.id ?? '';
  const { chatList, isLoadingChatList, errorChatList } = useFetchChatList(userId);
  const router = useRouter();

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

  useEffect(() => {
    // Refetch chat list when selectedChatId changes
    refetchChatList();
  }, [selectedChatId]);

  return (
    <ChatLayout
      chatList={chatList}
      onChatSelect={handleChatSelect}
      selectedChatId={selectedChatId}
      chatMessages={[]}
      refetch={refetchChatList}
    />
  );
};

ChatPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Layout>{page}</Layout>
    </>
  );
};

export default ChatPage;
