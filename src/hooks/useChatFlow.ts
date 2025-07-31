// src/hooks/useChatFlow.ts

import { useRef, useState } from 'react';
import { Message, ChatStep} from '../types/chat';
import { PropertyModel } from '../types/property';
import { getPropertyInsights } from '../services/aiService';
import { getFAQAnswer } from '../services/faqsService';
import { isChatPropertyArray, sanitizeAnswer } from '../utils/chatUtils';
import { getReceipt } from '../services/receiptService';
import ReceiptCard from '../components/ReceiptCard'; // or wherever it's imported
import { ReceiptModel } from '../types/receipt';

export function useChatFlow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [chatStep, setChatStep] = useState<ChatStep>(null);
  const [bookingDetails, setBookingDetails] = useState({
    city: '',
    district: '',
    districtCoordinates: { lat: 0, lng: 0 },
    dates: '',
    startDate: '',
    endDate: '',
    priceRange: '',
    minPrice: '',
    maxPrice: '',
    booking_id: '', // ✅ add this
    email: '',       // ✅ and this
  });
  const [pricesRange, setPriceRange] = useState<[number, number]>([400, 600]);
  const [latestInsight, setLatestInsight] = useState<string | null>(null);
  const [properties, setProperties] = useState<PropertyModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isTyping, setIsTyping] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showProperties, setShowProperties] = useState(false);
  const [awaitingDateConfirmation, setAwaitingDateConfirmation] = useState<null | {
    range: 'spring' | 'fall';
    proposedDateRange: string;
    startDate: string;
    endDate: string;
  }>(null);
  const [resetComplete, setResetComplete] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [receiptData, setReceiptData] = useState<ReceiptModel | null>(null);


   const sendMessage = async (content?: string) => {
      const messageText = content ?? input.trim();
      if (!messageText) return;
    
      const userMsg: Message = { role: 'user', content: messageText };
      setMessages(prev => [...prev, userMsg]);
      setInput('');
    
      // ✅ Date Confirmation Flow
      if (awaitingDateConfirmation) {
        const answer = messageText.toLowerCase();
    
        if (answer.includes('yes') || answer.includes('correct')) {
          setBookingDetails(prev => ({
            ...prev,
            dates: awaitingDateConfirmation.proposedDateRange,
            startDate: awaitingDateConfirmation.startDate,
            endDate: awaitingDateConfirmation.endDate,
          }));
          setAwaitingDateConfirmation(null);
          setChatStep('price');
    
          setIsTyping(true);
          setTimeout(() => {
            setMessages(prev => [
              ...prev,
              {
                role: 'assistant',
                content: 'Thanks for confirming! What is your preferred price range? (e.g. $50–$100)',
              }
            ]);
            setIsTyping(false);
          }, 1000);
        } else {
          setAwaitingDateConfirmation(null);
          setIsTyping(true);
          setTimeout(() => {
            setMessages(prev => [
              ...prev,
              {
                role: 'assistant',
                content: 'No problem. Please select a different date range:',
              }
            ]);
            setIsTyping(false);
          }, 1000);
        }
        return;
      }
    
      // ✅ Trigger district selection flow
      if (messageText.toLowerCase().includes('properties in lima')) {
        setBookingDetails({
          city: 'Lima',
          district: '',
          districtCoordinates: { lat: 0, lng: 0 },
          dates: '',
          startDate: '',
          endDate: '',
          priceRange: '',
          minPrice: '',
          maxPrice: '',
          booking_id:'',
          email:'',
        });
        setChatStep('district');
    
        setIsTyping(true);
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: 'Which district in Lima are you most interested in?',
            }
          ]);
          setIsTyping(false);
        }, 1000);
        return;
      }

      if (chatStep === 'receipt_booking_id') {
        setIsTyping(true);
      
        setBookingDetails(prev => ({
          ...prev,
          booking_id: input.trim(),
        }));
      
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: 'Thanks! Now enter the email used for the booking.',
          },
        ]);
      
        setInput('');
        setChatStep('receipt_email');
        setIsTyping(false); // ✅ stop typing after assistant message is shown
        return;
      }
      
      
      if (chatStep === 'receipt_email') {
        const emailInput = input.trim();
        setIsTyping(true);
        setBookingDetails(prev => ({
          ...prev,
          email: emailInput,
        }));
      
        setInput('');
        setChatStep('moreInfo');
      
        try {
          const receipt = await getReceipt(bookingDetails.booking_id, emailInput);
      
          if (!receipt) {
            setMessages(prev => [
              ...prev,
              {
                role: 'assistant',
                type: 'text',
                content: "Sorry, we couldn't find a receipt with that information. Would you like help from our support team?",
              },
              {
                role: 'assistant',
                type: 'action',
                content: 'Request personal assistance here:',
                data: [{ label: 'Contact Support', action: 'open_contact_modal' }],
              },
            ]);
            setIsTyping(false);
            return;
          }
          
      
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: 'Generating your receipt...',
            },
          ]);
      
          //setReceiptData(receipt);

          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              type: 'receipt',
              content: '', // not needed here
              data: receipt, // full ReceiptModel object
            },
          ]);
          
          console.log(receipt);
        } catch (err) {
          console.error(err);
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: 'An error occurred while retrieving the receipt.',
            },
          ]);
        } finally {
          setIsTyping(false); // ✅ always clear typing
        }
      
        return;
      }
      
      
      

      // ✅ Handle moreInfo FAQ flow
      if (chatStep === 'moreInfo') {
        setIsTyping(true);

        try {
          const result = await getFAQAnswer(messageText);

          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              type: 'text',
              content: result.answer,
            },
          ]);

          if (result.matched_question === null) {
            setMessages(prev => [
              ...prev,
              {
                role: 'assistant',
                type: 'action',
                content: 'Request personal assistance here',
                data: [{ label: 'Contact Support', action: 'open_contact_modal' }],
              },
            ]);
          }
        } catch (error) {
          console.error('FAQ API error:', error);
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              type: 'text',
              content: "Sorry, we encountered an issue finding an answer. Would you like help from our support team?",
            },
            {
              role: 'assistant',
              type: 'action',
              content: 'Request personal assistance here',
              data: [{ label: 'Contact Support', action: 'open_contact_modal' }],
            },
          ]);
        } finally {
          setIsTyping(false);
        }

        return;
      }

    
      // ✅ Property Insights Flow
      const shouldTriggerInsights = properties && properties.length > 0 && messageText.length > 2;
    
      if (shouldTriggerInsights) {
        setIsTyping(true);
    
        try {
          const insightResponse = await getPropertyInsights(messageText, properties);
          const answer = insightResponse?.answer?.trim();
    
          if (!answer) {
            // Empty string answer
            throw new Error('Empty answer');
          }
  
         // console.error('Answer here :', answer);
    
          let parsed: any;
          let rendered = false;
    
          try {
            const sanitized = sanitizeAnswer(answer);
            parsed = JSON.parse(sanitized);
            if (Array.isArray(parsed) && parsed.length === 0) {
              throw new Error('Empty JSON array');
            }
            //console.error('Parsed:', parsed);
            if (isChatPropertyArray(parsed)) {
              setMessages(prev => [
                ...prev,
                {
                  role: 'assistant',
                  type: 'chatProperties',
                  content: '',
                  data: parsed,
                }
              ]);
              rendered = true;
            }
            else{
              console.warn('Parsed object did not match ChatProperty[] shape', parsed);
            }
          } catch (err) {
            // Not JSON or bad format; continue to render as plain text
          }
    
          if (!rendered) {
            setMessages(prev => [
              ...prev,
              {
                role: 'assistant',
                type: 'text',
                content: answer,
              }
            ]);
          }
        } catch (error) {
          console.error('Insight Error:', error);
    
          // 🔹 Handle empty, invalid, or error gracefully
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              type: 'text',
              content: "We're having trouble finding a clear answer for that. Would you like to speak with a real person?",
            },
            {
              role: 'assistant',
              type: 'action',
              content: 'Request personal assistance',
              data: [{ label: 'Contact Support', action: 'open_contact_modal' }],
            }
          ]);
        } finally {
          setIsTyping(false);
        }
        return;
      }
    
      // 🧼 Default fallback
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            type: 'text',
            content: "I'm here to help! Could you please rephrase or clarify your request?",
          },
          {
            role: 'assistant',
            type: 'action',
            content: 'Need help from a real person?',
            data: [{ label: 'Contact Support', action: 'open_contact_modal' }],
          }
        ]);
        setIsTyping(false);
      }, 1000);
    };
  
  return {
    // state
    messages, setMessages,
    input, setInput,
    chatStep, setChatStep,
    bookingDetails, setBookingDetails,
    pricesRange, setPriceRange,
    latestInsight, setLatestInsight,
    properties, setProperties,
    loading, setLoading,
    isTyping, setIsTyping,
    searchResults, setSearchResults,
    showProperties, setShowProperties,
    awaitingDateConfirmation, setAwaitingDateConfirmation,
    resetComplete, setResetComplete,
    showScrollButton, setShowScrollButton,
    showModal, setShowModal,
    isAtBottom, setIsAtBottom,

    // refs
    scrollContainerRef,
    bottomRef,
    containerRef,
    receiptData, setReceiptData,
    sendMessage, 
  };
}
