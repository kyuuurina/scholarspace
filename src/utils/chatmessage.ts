// add import in api.ts
import { useQuery } from '@tanstack/react-query';
import { api } from './api';

// Fetch the chat list for a specific user
export const useFetchChatList = (userId: string) => {
  const chatList = api.chat.getChatList.useQuery(
    {
      user_id: userId,
    },
    {
      enabled: !!userId,
    }
  );

  const { data: chatListData, isLoading: isLoadingChatList, error: errorChatList } = chatList;

  return {
    chatList: chatListData || [],
    isLoadingChatList,
    errorChatList,
  };
};

// Fetch messages for a specific chat
export const useFetchChatMessages = (chatId: number) => {
  const chatMessages = api.chat.getChatMessages.useQuery(
    {
      chat_id: chatId,
    },
    {
      enabled: !!chatId,
    }
  );

  const { data: chatMessagesData, isLoading: isLoadingChatMessages, error: errorChatMessages } = chatMessages;

  return {
    chatMessages: chatMessagesData || [],
    isLoadingChatMessages,
    errorChatMessages,
  };
};


// export const useFetchChatMessages = (chatId: number) => {
//   const chatMessages = api.chat.getChatMessages.useQuery<ChatMessage[]>(
//     {
//       chat_id: chatId,
//     },
//     {
//       enabled: !!chatId,
//     }
//   );

//   const { data: chatMessagesData, isLoading: isLoadingChatMessages, error: errorChatMessages } = chatMessages;

//   return {
//     chatMessages: chatMessagesData || [],
//     isLoadingChatMessages,
//     errorChatMessages,
//   };
// };
