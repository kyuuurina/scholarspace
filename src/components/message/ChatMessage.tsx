import React from "react";

interface ChatMessageProps {
    message: {
      id: string;
      user_id: string;
      content: string;
    };
  }
  
  const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    return (
      <div>
        <p>{message.content}</p>
      </div>
    );
  };
  
  export default ChatMessage;