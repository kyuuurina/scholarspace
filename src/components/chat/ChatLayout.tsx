// import React from 'react';
// import ChatHistory from './ChatHistory';
// import ChatBubble from './ChatBubble';

// const ChatLayout = () => {
//   const chatHistory = [
//     // Sample chat history items
//     { message: 'Hello!', isMyMessage: false },
//     { message: 'Hi there!', isMyMessage: true },
//   ];

//   return (
//     <div className="flex h-screen">
//       <ChatHistory />
//       <div className="flex-1 p-4">
//         <div className="bg-white h-full rounded-lg shadow-lg p-4">
//           <div className="h-5/6 overflow-y-scroll">
//             {chatHistory.map((item, index) => (
//               <ChatBubble
//                 key={index}
//                 message={item.message}
//                 isMyMessage={item.isMyMessage}
//               />
//             ))}
//           </div>
//           <div className="h-1/6 mt-4">
//             {/* Input field and send button go here */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatLayout;
