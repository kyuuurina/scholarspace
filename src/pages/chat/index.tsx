// src/pages/chat/index.tsx
import React from 'react';
import ChatList from '../../components/chat/ChatList';
import { useUser } from '@supabase/auth-helpers-react';

const ChatPage: React.FC = () => {
  // You may need to provide the user2_id dynamically

//   const user = useUser();
//   const user2_id = user?.id ?? '';

const user = useUser();
const userId = user?.id ?? '';

  return (
    <div>
      <h1>Chat Page</h1>
      <ChatList userId={userId} />
    </div>
  );
};

export default ChatPage;