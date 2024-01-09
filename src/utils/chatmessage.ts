// add import in api.ts
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
