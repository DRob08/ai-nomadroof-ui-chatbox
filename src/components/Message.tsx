import React from 'react';
import { Message } from '../types/chat';

const MessageComponent: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <div className={`p-3 my-2 rounded-xl max-w-xl ${message.role === 'user' ? 'bg-blue-100 self-end ml-auto' : 'bg-gray-100 self-start mr-auto'}`}>
      <p>{message.content}</p>
    </div>
  );
};

export default MessageComponent;
