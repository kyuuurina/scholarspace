// // ChatInput.tsx

// import React, { useState } from 'react';
// import { supabase } from '../../utils/supabase';

// const ChatInput: React.FC = () => {
//   const [message, setMessage] = useState('');

//   const handleSendMessage = async () => {
//     if (message.trim() === '') return;

//     try {
//       // Insert the new message into the 'chat_message' table
//       await supabase.from('chat_message').upsert([
//         {
//           user_id: supabase.auth.user()?.id,
//           content: message,
//         },
//       ]);

//       // Clear the input field
//       setMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         placeholder="Type your message..."
//       />
//       <button onClick={handleSendMessage}>Send</button>
//     </div>
//   );
// };

// export default ChatInput;
