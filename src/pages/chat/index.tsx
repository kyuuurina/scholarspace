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
import { useQuery } from "@tanstack/react-query";

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

  //query key for refetch
  const QueryKey = ["getPost",selectedChatId];
  const { data: updatedMessage, refetch: refetchMessage } = useQuery(
    QueryKey,
    { enabled: false } // Disable automatic fetching on mount
  );

  return (
    <ChatLayout
      chatList={chatList}
      onChatSelect={handleChatSelect}
      selectedChatId={selectedChatId}
      chatMessages={[]}
      refetch={refetchMessage}
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
