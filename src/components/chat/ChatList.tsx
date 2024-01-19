//unused file

// src/components/chat/ChatList.tsx
import React from "react";
import { useFetchChatList } from "~/utils/chatmessage";
import ChatItem from "./ChatItem";

interface Profile {
  profile_id: string;
  name: string;
  avatar_url: string | null;
}

interface UserProfile {
  id: string;
  name?: string | null;
  avatar_url?: string | null;
  profile?: Profile[];
}

interface ChatListData {
  chat_id: bigint;
  user_chat_user1_idTouser?: UserProfile;
  user_chat_user2_idTouser?: UserProfile;
}

interface ChatListProps {
  userId: string;
}

const ChatList: React.FC<ChatListProps> = ({ userId }) => {
  const { chatList, isLoadingChatList, errorChatList } =
    useFetchChatList(userId);

  if (isLoadingChatList) {
    return <div>Loading...</div>;
  }

  if (errorChatList) {
    return <div>Error loading chat list</div>;
  }

  return (
    <div>
      <h2>Your Chats</h2>
      <ul>test</ul>
    </div>
  );
};

export default ChatList;
