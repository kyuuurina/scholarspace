import React from 'react';

interface ChatItemProps {
  chat: {
    chat_id: bigint;
    user_chat_user1_idTouser?: {
      id: string;
      name?: string | null;
      avatar_url?: string | null;
    };
    user_chat_user2_idTouser?: {
      id: string;
      name?: string | null;
      avatar_url?: string | null;
    };
  };
}

const ChatItem: React.FC<ChatItemProps> = ({ chat }) => {
  if (!chat || !chat.user_chat_user1_idTouser || !chat.user_chat_user2_idTouser) {
    // Return null or handle the case where the data is not available
    console.error("Invalid chat data:", chat);
    return null;
  }

  const user1 = chat.user_chat_user1_idTouser;
  const user2 = chat.user_chat_user2_idTouser;

  console.log("Chat ID:", chat.chat_id.toString());
  console.log("User 1:", user1);
  console.log("User 2:", user2);

  return (
    <div>
      <p>Chat ID: {chat.chat_id.toString()}</p>
      <p>User 1: {user1.name || 'No Name'}</p>
      <p>User 2: {user2.name || 'No Name'}</p>
      {/* Add more details or customize based on your requirements */}
    </div>
  );
};

export default ChatItem;
