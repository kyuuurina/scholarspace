import React from 'react';

const ChatBubble = ({ message, isMyMessage }: { message: string; isMyMessage: boolean }) => {
  const bubbleClasses = isMyMessage
    ? 'bg-blue-500 text-white'
    : 'bg-gray-300 text-gray-700';
  const bubbleContainerClasses = isMyMessage
    ? 'flex justify-end'
    : 'flex justify-start';

  return (
    <div className={`w-3/4 my-2 p-2 rounded-lg ${bubbleContainerClasses}`}>
      <div className={`py-2 px-4 rounded-lg ${bubbleClasses}`}>
        {message}
      </div>
    </div>
  );
};

export default ChatBubble;
