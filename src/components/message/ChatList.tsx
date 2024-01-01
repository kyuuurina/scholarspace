// // ChatList.tsx

// import React, { useEffect, useState } from 'react';
// import { supabase } from '../../utils/supabase';
// import ChatMessage from './ChatMessage';

// interface Message {
//   id: number;
//   // Add other properties as per your message structure
// }

// const ChatList: React.FC = () => {
//   const [messages, setMessages] = useState<Message[]>([]);

//   useEffect(() => {
//     // Create a function to fetch initial messages
//     const fetchMessages = async () => {
//       try {
//         const { data, error } = await supabase
//           .from('chat_message')
//           .select('*')
//           .order('created_at', { ascending: true });

//         if (data) {
//           setMessages(data as Message[]);
//         }

//         // Handle error
//         if (error) {
//           console.error('Error fetching messages:', error);
//         }
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     // Fetch initial messages
//     void fetchMessages();

//     // Set up Realtime listener for new messages
//     const subscription = supabase
//       .from('chat_message')
//       .on('INSERT', (payload) => {
//         // Update state with new message
//         setMessages((prevMessages) => [...prevMessages, payload.new]);
//       })
//       .subscribe();

//     // Clean up the subscription on component unmount
//     return () => {
//       subscription.unsubscribe();
//     };
//   }, []); // Empty dependency array to run the effect only once

//   return (
//     <div>
//       {messages.map((message) => (
//         <ChatMessage key={message.id} message={message} />
//       ))}
//     </div>
//   );
// };

// export default ChatList;
