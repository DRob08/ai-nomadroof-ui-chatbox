import React from 'react';
import MessageItem from './MessageItem';
import ContactForm from './ContactForm';
import PriceRangeSelector from './PriceRangeSelector';
import TypingIndicator from './TypingIndicator';
import { Message, ChatStep, AwaitingDateConfirmation } from '../types/chat';

type ChatConvoPanelProps = {
  messages: Message[];
  showModal: boolean;
  setShowModal: (v: boolean) => void;
  handleSuggestedQuestion: (text: string) => void;
  handleSuggestionClick: (text: string) => void;
  handleAction: (action: any) => void;
  resetChat: () => void;
  isTyping: boolean;
  chatStep: ChatStep;
  districtOptions: { name: string }[];
  handleDistrictSelection: (district: string) => void;
  handleDateSelection: (season: 'spring' | 'fall') => void;
  awaitingDateConfirmation: AwaitingDateConfirmation;
  handleQuickResponse: (response: 'yes' | 'no') => void;
  generalFAQSuggestions: string[];
  handleFAQFollowUp: (faq: string) => void;
  pricesRange: any; // refine this type as needed
  setPriceRange: (range: any) => void;
  handleConfirmPrice: () => void;
  sendMessage: (msg?: string) => void;
  initialSuggestions: string[];
  bottomRef: React.RefObject<HTMLDivElement | null>;
};

const ChatConvoPanel: React.FC<ChatConvoPanelProps> = ({
  messages,
  showModal,
  setShowModal,
  handleSuggestedQuestion,
  handleSuggestionClick,
  handleAction,
  resetChat,
  isTyping,
  chatStep,
  districtOptions,
  handleDistrictSelection,
  handleDateSelection,
  handleQuickResponse,
  awaitingDateConfirmation,
  generalFAQSuggestions,
  handleFAQFollowUp,
  pricesRange,
  setPriceRange,
  handleConfirmPrice,
  sendMessage,
  initialSuggestions,
  bottomRef,
}) => {
  return (
    <>
      {messages.map((msg, i) => (
        <MessageItem
          key={i}
          msg={msg}
          handleSuggestedQuestion={handleSuggestedQuestion}
          handleSuggestionClick={handleSuggestionClick}
          handleAction={handleAction}
        />
      ))}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="relative bg-white rounded-xl w-full max-w-md p-6">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <ContactForm onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}

{messages.length === 1 && (
  <div className="flex flex-wrap gap-2 mt-2">
    {initialSuggestions.map((text, i) => (
      <button
        key={i}
        onClick={() =>
          ['general information', 'get booking receipt'].includes(text.toLowerCase())
            ? handleSuggestedQuestion(text)
            : sendMessage(text)
        }
        className="bg-[#f5694b]/10 hover:bg-[#f5694b]/20 text-sm text-[#f5694b] px-4 py-2 rounded-lg border border-[#f5694b]"
      >
        {text}
      </button>
    ))}
  </div>
)}


      {isTyping && <TypingIndicator />}

      {chatStep === 'district' && !isTyping && (
        <div className="flex flex-wrap gap-2 mt-2">
          {districtOptions.map((d, i) => (
            <button
              key={i}
              onClick={() => handleDistrictSelection(d.name)}
              className="bg-purple-100 hover:bg-purple-200 text-sm text-purple-800 px-4 py-2 rounded-lg border border-purple-400"
            >
              {d.name}
            </button>
          ))}
        </div>
      )}

      {chatStep === 'date' && !awaitingDateConfirmation && !isTyping && (
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => handleDateSelection('spring')}
            className="bg-blue-100 hover:bg-blue-200 text-sm text-blue-800 px-4 py-2 rounded-lg border border-blue-400"
          >
            March to July
          </button>
          <button
            onClick={() => handleDateSelection('fall')}
            className="bg-green-100 hover:bg-green-200 text-sm text-green-800 px-4 py-2 rounded-lg border border-green-400"
          >
            August to December
          </button>
        </div>
      )}

      {chatStep === 'faqIntro' && !isTyping && (
        <div className="flex flex-wrap gap-2 mt-2">
          {generalFAQSuggestions.map((faq, i) => (
            <button
              key={i}
              onClick={() => handleFAQFollowUp(faq)}
              className="bg-orange-100 hover:bg-orange-200 text-sm text-orange-800 px-4 py-2 rounded-lg border border-orange-300"
            >
              {faq}
            </button>
          ))}
        </div>
      )}

      {chatStep === 'price' && !isTyping && (
        <PriceRangeSelector
          pricesRange={pricesRange}
          setPriceRange={setPriceRange}
          handleConfirmPrice={handleConfirmPrice}
        />
      )}

      {awaitingDateConfirmation && !isTyping && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => handleQuickResponse('yes')}
            className="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 text-sm rounded-lg border border-green-400"
          >
            Yes
          </button>
          <button
            onClick={() => handleQuickResponse('no')}
            className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 text-sm rounded-lg border border-red-400"
          >
            No
          </button>
        </div>
      )}

      <div ref={bottomRef} />
    </>
  );
};

export default ChatConvoPanel;
