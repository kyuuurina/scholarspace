// src/pages/chat/index.tsx
import React from 'react';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '~/pages/_app';
import Head from '~/components/layout/Head';
import Layout from '~/components/layout/Layout';
import ChatLayout from '~/components/chat/ChatLayout'; // Import the ChatLayout component
import { useUser } from '@supabase/auth-helpers-react';
import { useFetchChatList } from '~/utils/chatmessage';

const ChatPage: NextPageWithLayout = () => {
  const user = useUser();
  const userId = user?.id ?? '';
  const { chatList, isLoadingChatList, errorChatList } = useFetchChatList(userId);

  return (
    <ChatLayout chatList={chatList}>
      {/* Additional components for the message section */}
    </ChatLayout>
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

// src/pages/chat/index.tsx
// import React from 'react';
// import type { ReactElement } from 'react';
// import type { NextPageWithLayout } from '~/pages/_app';
// import Head from '~/components/layout/Head';
// import Layout from '~/components/layout/Layout';
// import ChatItem from '~/components/chat/ChatItem';
// import { useUser } from '@supabase/auth-helpers-react';
// import { useFetchChatList } from '~/utils/chatmessage';

// const ChatPage: NextPageWithLayout = () => {
//   const user = useUser();
//   const userId = user?.id ?? '';
//   const { chatList, isLoadingChatList, errorChatList } = useFetchChatList(userId);

//   return (
//     // No need to use an additional div with "flex" class, as the structure is already handled in the Layout component
//     <>
//       {/* Left Pane */}
//       <div className="flex flex-col pl-4">
//         {/* <h1 className="mb-4">Chat Page</h1> */}
//         {/* Add any other content you want in the left pane */}
//       </div>

//       {/* Chat List */}
//       <div className="flex-1 pl-4">
//         {isLoadingChatList && <div>Loading...</div>}
//         {errorChatList && <div>Error loading chat list</div>}
//         {chatList.map((chat) => (
//           <>
//             {/* Add a line separator between ChatItems */}
//             <hr className="my-4 border-t border-gray-300" />
//             <ChatItem key={chat.chat_id} chat={chat} />
//           </>
//         ))}
//       </div>
//     </>
//   );
// };

// ChatPage.getLayout = function getLayout(page: ReactElement) {
//   return (
//     <>
//       <Layout>{page}</Layout>
//     </>
//   );
// };

// export default ChatPage;
