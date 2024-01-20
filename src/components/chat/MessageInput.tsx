// src/components/chat/MessageInputSection.tsx
import React, { useState } from 'react';
import PrimaryButton from '../button/PrimaryButton';

interface MessageInputSectionProps {
  onSend: (message: string) => void;
}

const MessageInputSection: React.FC<MessageInputSectionProps> = ({ onSend }) => {
  const [messageInput, setMessageInput] = useState('');

  return (
    <div className="flex items-center mt-2 sticky bottom-0 bg-white p-4">
      <input
        type="text"
        placeholder="Type a message..."
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        className="p-2 border border-gray-300 rounded w-full mr-2" // Add appropriate margin to the right
      />
      <PrimaryButton
        name="Send"
        type="button"
        disabled={!messageInput.trim()}
        onClick={() => {
          onSend(messageInput);
          setMessageInput('');
        }}
      />
    </div>
  );
};

export default MessageInputSection;
