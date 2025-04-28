import { Message } from '../types/chat';

interface MessageItemProps {
  msg: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ msg }) => (
  <div className={`flex items-start space-x-2 ${msg.role === 'assistant' ? '' : 'flex-row-reverse'}`}>
    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200">
      {msg.role === 'assistant' ? '🤖' : '🧑'}
    </div>
    <div
      className={`max-w-xs rounded-lg px-4 py-2 text-sm whitespace-pre-line ${
        msg.role === 'assistant'
          ? 'bg-gray-100 text-gray-800'
          : 'bg-[#f5694b] text-white'
      }`}
    >
      {msg.content}
    </div>
  </div>
);

export default MessageItem;
