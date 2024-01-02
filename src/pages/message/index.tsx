// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/router";
// import { api } from "~/utils/api";
// import { type ZodType, z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import toast from "react-hot-toast";
// import { getCookie } from "cookies-next";
// import { useSupabaseClient } from "@supabase/auth-helpers-react";
// import { useSessionContext } from "@supabase/auth-helpers-react";
// import {supabase} from "~/utils/supabase";
// import { useFetchUsers } from "~/utils/user";

// //types
// import type { ReactElement } from "react";
// import { NextPageWithLayout } from "../_app";

// //components
// import Layout from "~/components/layout/Layout";
// import Head from "~/components/layout/Head";
// import FormErrorMessage from "~/components/FormErrorMessage";
// import SuccessToast from "~/components/toast/SuccessToast";
// import ErrorToast from "~/components/toast/ErrorToast";
// import Header from "~/components/workspace/Header";
// import LoadingSpinner from "~/components/LoadingSpinner";
// import ErrorPage from "~/pages/error-page";

// //chat components
// import EmptyState from "~/components/chat/EmptyState";
// import { ChatBubs } from "~/components/chat/ChatBubs";

// //utils

// const MessagePage: NextPageWithLayout = () => {
//     useSessionContext();
//     const userId = getCookie("UserID");
//     const { register, handleSubmit, reset } = useForm();

//     console.log("userId", userId)

//     const {users} = useFetchUsers();
//     const [messages, setMessages] = useState<any[]>([]);
//     const [recipientId, setRecipientId] = useState<string | null>(null);

//     useEffect(() => {
//       const fetchMessages = async () => {
//         // Fetch messages for the selected recipient
//         if (recipientId) {
//           const { data, error } = await supabase
//             .from('chat_message')
//             .select()
//             .or(`(sender_id.eq.${userId}.and.recipient_id.eq.${recipientId})`)
//             .or(`(sender_id.eq.${recipientId}.and.recipient_id.eq.${user.id})`);
  
//           if (error) {
//             console.error(error);
//           } else {
//             setMessages(data);
//           }
//         }
//       };
  
//       fetchMessages();
  
//       // Subscribe to new messages for the selected recipient
//       const subscription = supabase
//         .from('chat_message:recipient_id=eq.${user.id}')
//         .on('INSERT', (payload) => {
//           setMessages((prevMessages) => [...prevMessages, payload.new]);
//         })
//         .subscribe();
  
//       return () => {
//         subscription.unsubscribe();
//       };
//     }, [recipientId, user.id]);
  
//     const handleUserClick = (recipientId: string) => {
//       setRecipientId(recipientId);
//     };
  
//     const sendMessage = async (content: string) => {
//       if (recipientId) {
//         await supabase.from('chat_message').upsert([
//           { sender_id: user.id, recipient_id: recipientId, content },
//           { sender_id: recipientId, recipient_id: user.id, content },
//         ]);
//       }
//     };
  
//     return (
//       <div>
//         <div>
//           <h2>Users</h2>
//           {users.map((user) => (
//             <div key={user.userId} onClick={() => handleUserClick(user.userId)}>
//               {user.userName}
//             </div>
//           ))}
//         </div>
  
//         <div>
//           <h2>Messages</h2>
//           {messages.map((message) => (
//             <div key={message.id}>{message.content}</div>
//           ))}
//         </div>
  
//         <div>
//           <h2>Send Message</h2>
//           {recipientId && (
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 sendMessage('Hello, recipient!');
//               }}
//             >
//               <input type="text" value="Hello, recipient!" readOnly />
//               <button type="submit">Send Message</button>
//             </form>
//           )}
//         </div>
//       </div>
//     );
//   };

// MessagePage.getLayout = function getLayout(page: ReactElement) {
//     return (
//       <>
//         <Layout>{page}</Layout>
//       </>
//     );
//   };
  
//   export default MessagePage;