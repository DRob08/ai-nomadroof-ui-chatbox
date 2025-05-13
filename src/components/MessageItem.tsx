import { Message } from '../types/chat';
import PropertyCard from './PropertyCard'; // adjust to your actual path

interface MessageItemProps {
  msg: Message;
  handleSuggestedQuestion: (question: string) => void;
  handleSuggestionClick?: (suggestion: string) => void; // NEW
}

const MessageItem: React.FC<MessageItemProps> = ({ msg, handleSuggestedQuestion, handleSuggestionClick }) => {
  // Property list rendering
  if (msg.type === 'properties' && Array.isArray(msg.data)) {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Matching Properties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
          {msg.data.map((property, index) => (
            <PropertyCard key={property.half_property_url || index} property={property} />
          ))}
        </div>
      </div>
    );
  }

  // Insight message
  if (msg.type === 'insight') {
    return (
      <div className="flex items-start space-x-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200">🤖</div>
        <div className="max-w-xs rounded-lg px-4 py-2 text-sm bg-gray-100 text-gray-800 whitespace-pre-line">
          <strong>Insight:</strong> {msg.content}
        </div>
      </div>
    );
  }

  //  // Quick Insights suggestions (new block)
  //  if (msg.type === 'suggestions' && Array.isArray(msg.data)) {
  //   return (
  //     <div className="mt-6">
  //       <h2 className="text-md font-semibold mb-2">Quick Suggestions</h2>
  //       <div className="flex flex-wrap gap-2">
  //         {msg.data.map((q: string, i: number) => (
  //           <button
  //             key={i}
  //             onClick={() => handleSuggestedQuestion(q)} // This is now in scope
  //             className="bg-[#f5694b]/10 hover:bg-[#f5694b]/20 text-sm text-[#f5694b] px-4 py-2 rounded-lg border border-[#f5694b]"
  //           >
  //             {q}
  //           </button>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }

  if ((msg.type === 'suggestions' || msg.type === 'flowSuggestions') && Array.isArray(msg.data)) {
    return (
      <div className="mt-6">
        <h2 className="text-md font-semibold mb-2">
          {msg.type === 'suggestions' ? 'Quick Suggestions' : 'Adjust Your Search'}
        </h2>
        <div className="flex flex-wrap gap-2">
          {msg.data.map((q: string, i: number) => (
            <button
              key={i}
              onClick={() => {
                if (msg.type === 'flowSuggestions') {
                  handleSuggestionClick?.(q);
                } else {
                  handleSuggestedQuestion(q);
                }
              }}
              className="bg-[#f5694b]/10 hover:bg-[#f5694b]/20 text-sm text-[#f5694b] px-4 py-2 rounded-lg border border-[#f5694b]"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    );
  }
  

  // Default text message
  const isAssistant = msg.role === 'assistant';

  return (
    <div className={`flex items-start space-x-2 ${isAssistant ? '' : 'flex-row-reverse'}`}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200">
        {isAssistant ? '🤖' : '🧑'}
      </div>
      <div
        className={`max-w-xs rounded-lg px-4 py-2 text-sm whitespace-pre-line ${
          isAssistant ? 'bg-gray-100 text-gray-800' : 'bg-[#f5694b] text-white'
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
};

export default MessageItem;
