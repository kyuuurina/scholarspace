
import React from "react";
import {useForm} from "react-hook-form";
import {useEffect, useRef, useState} from "react";
import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
// import supabase

//auth
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import SupabaseClient from "@supabase/auth-helpers-react";
import { useSessionContext } from "@supabase/auth-helpers-react";

//types
import type {Message} from "../../types/message";

//local components
import PrimaryButton from "../button/PrimaryButton";

const Chat = () => {
    const [messages, setMessages] = useState([]);

  // Fetch initial messages on component mount
//   useEffect(() => {
//     const fetchMessages = async () => {
//       const { data, error } = await supabase
//         .from("chat_message")
//         .select("*")
//         .order("created_at", { ascending: true });

//       if (error) {
//         console.error("Error fetching messages:", error);
//         return;
//       }

//       setMessages(data);
//     };

//     fetchMessages();

    // Set up real-time subscription for new messages
    // const subscription = supabase
    //   .from("chat_message")
    //   .on("INSERT", (payload) => {
    //     setMessages((prevMessages) => [...prevMessages, payload.new]);
    //   })
    //   .subscribe();

//     return () => {
//       // Cleanup subscription on component unmount
//       subscription.unsubscribe();
//     };
//   }, []);

//   return (
//     <div>
//         <ul>
//             <li key = {message.id}>{message.content}</li>
//         </ul>
//     </div>
//   )
};




// interface ChatProps {
//     messages: Message[];
// }

// export const Chat = ({messages: serverMessages}: ChatProps) => {
//     const [messages, setMessages] = useState<Message[]>(serverMessages);
//     const {register, handleSubmit, reset} = useForm();

//     // useEffect(() => {
//     //     const channel = supabase
//     //     .channel ("*")
//     //     .on(
//     //         "postgres_changes",
//     //         (payload) => {
//     //             console.log("Change received!", payload);
//     //             setMessages((messages) => [...messages, payload.new]);
//     //         }
//     //     )
//     // };

//     return (
//         <div className="flex h-full flex-col">
//             <div className="my-2">
//                 {messages.map((message) => (
//                     <div key={message.id}>
//                         <span className="font-bold">{message.user_id}</span>
//                         <span className="mx-2 text-gray-600">{message.content}</span>
//                     </div>
//                 ))}
//             </div>
//             <div className="mt-auto mb-5 py-2">
//                 {/* input form */}
//                 <form
//                  autoComplete="off"
//                  className="flex"
//                 //  onSubmit={handleSubmit(onSubmit)}
//                  >
//                  </form>
//             </div>
//         </div>
//     );
// };
