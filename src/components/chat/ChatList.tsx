import React from 'react';
import { useFetchChatList } from '~/utils/chatmessage';
import ChatItem from './ChatItem';

interface ChatListProps {
  userId: string;
}

const ChatList: React.FC<ChatListProps> = ({ userId }) => {
  const { chatList, isLoadingChatList, errorChatList } = useFetchChatList(userId);

  if (isLoadingChatList) {
    return <div>Loading...</div>;
  }

  if (errorChatList) {
    return <div>Error loading chat list</div>;
  }

  return (
    <div>
      <h2>Your Chats</h2>
      <ul>
        {chatList.map((chat) => (
          <li key={chat.chat_id}>
            <ChatItem chat={chat} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
// // src/components/ChatList.tsx
// import React from 'react';
// import { useFetchChats } from '~/utils/chatmessage';

// interface Chat {
//   chat_id: bigint;
//   user1_id: string;
//   user2_id: string;
//   created_at: Date;
// }

// interface ChatListProps {
//   user2_id: string;
// }

// const ChatList: React.FC<ChatListProps> = ({ user2_id }) => {
//   const { chats, isLoadingChats, errorChats } = useFetchChats(user2_id);

//   console.log(user2_id);

//   if (isLoadingChats) {
//     return <div>Loading...</div>;
//   }

//   if (errorChats) {
//     return <div>Error fetching chats: {errorChats.message}</div>;
//   }

//   // Ensure chats is an array
//   const chatsArray = Array.isArray(chats) ? (chats as Chat[]) : [];

//   // Render the list of chats
//   return (
//     <div>
//       <h2>Chats</h2>
//       <ul>
//         {chatsArray.map((chat) => (
//           <li key={chat.chat_id.toString()}>
//             <div>Chat ID: {chat.chat_id.toString()}</div>
//             <div>User 1 ID: {chat.user1_id}</div>
//             <div>User 2 ID: {chat.user2_id}</div>
//             <div>Created At: {chat.created_at.toString()}</div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ChatList;
