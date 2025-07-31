import React, { JSX, useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Message } from '../types/chat';
import { getProperties } from '../services/propertyService';
import { getPropertyInsights } from '../services/aiService';
import { PropertyModel } from '../types/property';
import PriceRangeSelector from './PriceRangeSelector'; // Import from the same folder
import PropertyCard from './PropertyCard'; // Import from the same folder
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';
import ContactForm from "./ContactForm"
import { ChatProperty } from '../types/chat';
import { getFAQAnswer } from '../services/faqsService';
import { useChatFlow } from '../hooks/useChatFlow';
import {
  formatISODate,
  formatDateRange,
  sanitizeAnswer,
  isChatPropertyArray,
} from '../utils/chatUtils';
import ChatConvoPanel from './ChatConvoPanel'; // adjust path if needed
import { event as trackEvent } from '../utils/ga';
import ReceiptCard from './ReceiptCard'; // Import from the same folder


const MIN = 0;
const MAX = 1000;
const STEP = 10;

const initialSuggestions = [
  'Search for properties in Lima',
  'General Information',
  'Get Booking receipt',
];

const suggestedQuestions = [
  "Which Distrcit has the most listings?",
  "What is the average price of properties?",
  "Which listings have pools or gyms?",
  "What Properties are close to PUCP and within how many km?",
];

//type ChatStep = null | 'district' | 'date' | 'confirmDates' | 'price' | 'done' | 'propertyInsights';

const districtOptions = [
  { name: 'Miraflores', lat: -12.1211, lng: -77.0297 },
  { name: 'Barranco', lat: -12.1449, lng: -77.0202 },
  { name: 'San Isidro', lat: -12.0972, lng: -77.0369 },
  { name: 'La Molina', lat: -12.0909, lng: -76.9350 },
  { name: 'Lince', lat: -12.0853, lng: -77.0342 },
  { name: 'Jesús María', lat: -12.0800, lng: -77.0431 },
];

const ChatBox: React.FC = () => {

  const generalFAQSuggestions = [
  'How do I book?',
  'Can I contact the landlord?',
  'How do I reserve my flat?',
  ];
 

  const {
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
  
    scrollContainerRef,
    bottomRef,
    containerRef,
    receiptData,setReceiptData,
    sendMessage, 
  } = useChatFlow();
  

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isUserAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
  
      setIsAtBottom(isUserAtBottom);
      setShowScrollButton(!isUserAtBottom);
    }
  };
  
  useEffect(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isUserAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
      const isOverflowing = scrollHeight > clientHeight;
  
      setShowScrollButton(isOverflowing && !isUserAtBottom);
    }
  }, [messages]);
  

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
  
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { role: 'assistant', content: 'Hi! What can I help you with today?' },
      ]);
    }
  }, []);
  
  const scrollToBottom = () => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth',
        });
        setIsAtBottom(true);
        setShowScrollButton(false);
      }
  };

  // This function will be passed down to MessageItem
  const handleAction = (action: string) => {
    if (action === 'open_contact_modal') {
    trackEvent({
      action: 'open_contact_modal',
      category: 'Engagement',
    });
      setShowModal(true);
    }
  };

  // Make sure the date range string also uses ISO dates
  // const formatDateRange = (startMonth: number, endMonth: number, year: number): string => {
  //   const start = new Date(year, startMonth - 1, 1);
  //   const end = new Date(year, endMonth, 0);
  //   return `${formatISODate(start)} to ${formatISODate(end)}`;
  // };

  const handleDateSelection = (range: 'spring' | 'fall') => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
    
      const [startMonth, endMonth] = range === 'spring' ? [3, 7] : [8, 12];
      const isPast = currentMonth > startMonth;
      const year = isPast ? currentYear + 1 : currentYear;
    
      const start = new Date(year, startMonth - 1, 1);
      const end = new Date(year, endMonth, 0);
    
      const formattedStart = formatISODate(start);
      const formattedEnd = formatISODate(end);
      const dateRange = formatDateRange(startMonth, endMonth, year);
    
      if (isPast) {
        setAwaitingDateConfirmation({
          range,
          proposedDateRange: dateRange,
          startDate: formattedStart,
          endDate: formattedEnd,
        });
    
        addAssistantMessageOnly(
          `It looks like the ${range === 'spring' ? 'March to July' : 'August to December'} semester is in the past for this year. Did you mean to plan for ${year}?`
        );
    
        return;
      }
    
      setBookingDetails(prev => ({
        ...prev,
        startDate: formattedStart,
        endDate: formattedEnd,
        dates: dateRange,
      }));

      //console.log("Booking details before request", bookingDetails);
    
      setChatStep('price');
      addAssistantMessage(
        range === 'spring' ? 'March to July' : 'August to December',
        `Got it! What is your preferred price range? (e.g. $50–$100)`
      );
  };
  
  const resetChat = () => {
    setMessages([]);
    setInput('');
    setChatStep(null);
    setBookingDetails({
      city: '',
      district: '',
      districtCoordinates: { lat: 0, lng: 0 },
      dates: '',
      startDate: '',
      endDate: '',
      priceRange: '',
      minPrice: '',
      maxPrice: '',
      booking_id:'',
      email:''
    });
    setPriceRange([400, 600]);
    setLatestInsight(null);
    setProperties([]);
    setLoading(true);
    setIsTyping(false);
    setSearchResults([]);
    setShowProperties(false);
    setAwaitingDateConfirmation(null);
    setReceiptData(null);

    // Set resetComplete flag to true to trigger scrolling
    setResetComplete(true);
    
    const Greetings: Message = {
      role: 'assistant',
      type: 'text',
      content: 'Hi! How can I assist you with your property search today?',
      data: '',
    };

    // Add suggestions after showing the properties
    setMessages(prev => [...prev, Greetings]);

    // Scroll to the top of the chat container
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    } 

    // Scroll to top
    setTimeout(() => {
      scrollContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100); 
  };
  
  const addAssistantMessage = (userSelection: string, assistantMessage: string, delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: 'user', content: userSelection },
        { role: 'assistant', content: assistantMessage },
      ]);
      setIsTyping(false);
    }, delay);
  };

  const addAssistantMessageOnly = (content: string, delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content }]);
      setIsTyping(false);
    }, delay);
  };

  const handleDistrictSelection = (districtName: string) => {
    const district = districtOptions.find((d) => d.name === districtName);
    if (!district) return;

    trackEvent({
      action: 'select_district',
      category: 'Chat',
      label: districtName,
    });

    setBookingDetails(prev => ({
      ...prev,
      district: district.name,
      districtCoordinates: { lat: district.lat, lng: district.lng },
    }));
    setChatStep('date');

    addAssistantMessage(
       district.name ,
      `Perfect! Let’s move on. Please select your desired date range:`
    );
  };

  const handleQuickResponse = (response: 'yes' | 'no') => {
    sendMessage(response);
  };

  const handleConfirmPrice = () => {
   
    const updatedBookingDetails = {
      ...bookingDetails,
      minPrice: pricesRange[0].toString(),
      maxPrice: pricesRange[1].toString(),
      priceRange: `${pricesRange[0]}-${pricesRange[1]}`,
      startDate: bookingDetails.startDate,  // <-- explicitly include
      endDate: bookingDetails.endDate,      // <-- explicitly include
    };
    
    //console.log('Updated Booking Details:', updatedBookingDetails);

    trackEvent({
      action: 'confirm_price_range',
      category: 'Chat',
      label: `${pricesRange[0]}-${pricesRange[1]}`,
      value: pricesRange[1], // optional: max price
    });
  
    setBookingDetails(updatedBookingDetails);
  
    const userMsg: Message = { role: 'user', content: `${pricesRange[0]}-${pricesRange[1]}` };
    setMessages(prev => [...prev, userMsg]);
  
    setChatStep('done');
  
    addAssistantMessageOnly(
      `Thanks! Here's what I found based on your criteria:\n\n📍 Location: ${updatedBookingDetails.city}, ${updatedBookingDetails.district}\n📅 Dates: ${updatedBookingDetails.dates}\n💵 Price Range: ${updatedBookingDetails.priceRange}\n\n(Showing search results...)`
    );
  
    setTimeout(async () => {
      setIsTyping(true);
      try {
        setLoading(true);
  
        const response = await getProperties({
          city: updatedBookingDetails.city,
          district: updatedBookingDetails.district,
          dates: updatedBookingDetails.dates,
          startDate: updatedBookingDetails.startDate,
          endDate: updatedBookingDetails.endDate,
          priceRange: updatedBookingDetails.priceRange,
          districtCoordinates: updatedBookingDetails.districtCoordinates,
          minPrice: updatedBookingDetails.minPrice,
          maxPrice: updatedBookingDetails.maxPrice,
        });
  
        setProperties(response);
        setShowProperties(true);
  
        if (response.length === 0) {
          setProperties([]); // Clear previous results
          setShowProperties(false);
        
          const noResultsSuggestions: Message = {
            role: 'assistant',
            type: 'flowSuggestions', // <-- changed from 'suggestions'
            content: 'Here are a few ways you could adjust your search:',
            data: [
              'Try a different district',
              'Increase your max price',
              //'Change your dates to include weekdays',
              //'Search all of the city instead of a specific area',
            ],
          };
          
          
          const noResultsText: Message = {
            role: 'assistant',
            type: 'text',
            content: `Hmm, I couldn't find any properties that match your criteria right now.\n\nYou might want to try expanding your search area, increasing your price range, or changing the dates.`,
          };

          const contactSupportMessage: Message = {
            role: 'assistant',
            type: 'action',
            content: `Would you like us to help you personally?`,
            data: [
              { label: 'Contact Support', action: 'open_contact_modal' },
            ],
          };
          
          setMessages(prev => [...prev, noResultsText, noResultsSuggestions, contactSupportMessage ]);
          
          return;
        }
  
        addAssistantMessageOnly(`Here are ${response.length} properties based on your criteria:`);
       // console.log(response)

       // ✅ Track properties shown
        trackEvent({
          action: 'show_properties',
          category: 'Search',
          label: `${response.length} properties shown`,
          value: response.length,
        });

        const propertiesMsg: Message = {
          role: 'assistant',
          type: 'properties',
          content: '',
          data: response,
        };
        if (response.length > 0) {
          setTimeout(() => {
            setMessages(prev => [...prev, propertiesMsg]);
    
            const suggestionsMsg: Message = {
              role: 'assistant',
              type: 'suggestions',
              content: 'Here are some quick insights for you:',
              data: suggestedQuestions,
            };

            setMessages(prev => [...prev, suggestionsMsg]);
          }, 1000);
        }
      
      } catch (error) {
        console.error('Error fetching properties:', error);

        // ✅ Track the error event in GA
        trackEvent({
          action: 'search_error',
          category: 'Search',
          label: (error as Error).message || 'Unknown error',
        });
      
        const errorMessage: Message = {
          role: 'assistant',
          type: 'text',
          content: `Oops! Something went wrong while searching. Please try again in a moment.`,
        };
      
        const contactSupportMessage: Message = {
          role: 'assistant',
          type: 'action',
          content: `Would you like us to help you personally?`,
          data: [{ label: 'Connect', action: 'open_contact_modal' }],
        };
      
        setMessages(prev => [...prev, errorMessage, contactSupportMessage]);
      }
       finally {
        setIsTyping(false);
        setLoading(false);
      }
    }, 1100);
  };

  const handleSuggestionClick = (suggestion: string) => {
    switch (suggestion) {
      case 'Try a different district':
        setChatStep('district');
        //setSelectedDistrict(null); // or however you're resetting this step
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            type: 'text',
            content: 'Okay, let’s try a different district. Which area are you interested in?',
          },
        ]);
        break;
  
      case 'Increase your max price':
        setChatStep('price'); // example: return to max price input
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            type: 'text',
            content: 'Sure, what’s your updated maximum price?',
          },
        ]);
        break;
  
      case 'Change your dates to include weekdays':
        setChatStep('date');
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            type: 'text',
            content: 'Got it. What new dates would you like to try?',
          },
        ]);
        break;
  
      case 'Search all of the city instead of a specific area':
        //setSelectedDistrict('all'); // or whatever value represents “entire city”
       //---- fetchPropertiesAgain(); // Trigger your search again with wider filter
        break;
  
      default:
        // Optional fallback
        break;
    }
  };

  const handleSuggestedQuestion = async (question: string) => {
     trackEvent({
      action: 'select_suggested_question',
      category: 'Chat',
      label: question,
    });
    // ✅ Check for "General Information"
  if (question.toLowerCase() === 'general information') {
    setMessages(prev => [
      ...prev,
      { role: 'user', type: 'text', content: question },
      {
        role: 'assistant',
        type: 'text',
        content: 'Sure! What would you like to know about?',
      },
    ]);

   

    setChatStep('faqIntro'); // Used to trigger FAQ follow-ups in JSX
    return; // ✅ Exit early — skip the rest of this function
  }

  if (question.toLowerCase().includes('receipt')) {
    setMessages(prev => [
      ...prev,
      { role: 'user', type: 'text', content: question },
      {
        role: 'assistant',
        type: 'text',
        content: 'Sure! Please enter your Booking ID.',
      },
    ]);
    setChatStep('receipt_booking_id'); // 👈 first substep
    return;
  }
  
    setChatStep('propertyInsights');
    setIsTyping(true);
  
    const fallbackSupportMessages: Message[] = [
      {
        role: 'assistant',
        type: 'text',
        content: 'Sorry, we couldn’t find anything useful for that. Would you like personal assistance?',
      },
      {
        role: 'assistant',
        type: 'action',
        content: 'Request personal assistance here',
        data: [{ label: 'Contact Support', action: 'open_contact_modal' }],
      },
    ];
  
    try {
      const insightResponse = await getPropertyInsights(question, properties);
      const raw = insightResponse.answer?.trim();
  
      // Track user question
      setMessages(prev => [
        ...prev,
        { role: 'user', type: 'text', content: question },
      ]);
  
      if (!raw) {
        setMessages(prev => [...prev, ...fallbackSupportMessages]);
        return;
      }
  
      let parsed: any;
      try {
        const sanitized = sanitizeAnswer(raw);
        parsed = JSON.parse(sanitized);
       //parsed = JSON.parse(raw);
  
        if (isChatPropertyArray(parsed)) {
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              type: 'chatProperties',
              content: '',
              data: parsed,
            },
          ]);
          return;
        }
      } catch (err) {
        console.warn('Invalid JSON in insight answer:', err);
      }
  
      // Fallback to plain text if not valid JSON/chat properties
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          type: 'text',
          content: raw,
        },
      ]);
    } catch (err) {
      console.error('handleSuggestedQuestion error:', err);
  
      setMessages(prev => [
        ...prev,
        { role: 'user', type: 'text', content: question },
        {
          role: 'assistant',
          type: 'text',
          content: 'We encountered a technical issue. Would you like help from our team?',
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
  };

  const handleFAQFollowUp = async (question: string) => {
    setChatStep('moreInfo');
  
    // Show user's question
    setMessages(prev => [
      ...prev,
      { role: 'user', type: 'text', content: question },
    ]);
  
    try {
      const result = await getFAQAnswer(question);
  
      // Always show the assistant's response
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          type: 'text',
          content: result.answer,
        },
      ]);
  
      // If no matched question, optionally show contact support option
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
    }
  };
  

  return (
    <div ref={scrollContainerRef}  className="flex flex-col h-screen p-4 relative">
         {/*    <div ref={scrollContainerRef} /> */}
      <div ref={containerRef} className="flex-1 overflow-y-auto space-y-4 pr-4 scrollbar-thin scrollbar-thumb-gray-400">
          {messages.length > 0 && (
            <button
              onClick={resetChat}
              className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 text-sm rounded hover:bg-red-600 shadow-md z-10"
            >
              Start Over
            </button>
          )}

        <ChatConvoPanel
          messages={messages}
          showModal={showModal}
          setShowModal={setShowModal}
          handleSuggestedQuestion={handleSuggestedQuestion}
          handleSuggestionClick={handleSuggestionClick}
          handleAction={handleAction}
          resetChat={resetChat}
          isTyping={isTyping}
          chatStep={chatStep}
          districtOptions={districtOptions}
          handleDistrictSelection={handleDistrictSelection}
          handleDateSelection={handleDateSelection}
          awaitingDateConfirmation={awaitingDateConfirmation}
          handleQuickResponse={handleQuickResponse}
          generalFAQSuggestions={generalFAQSuggestions}
          handleFAQFollowUp={handleFAQFollowUp}
          pricesRange={pricesRange}
          setPriceRange={setPriceRange}
          handleConfirmPrice={handleConfirmPrice}
          sendMessage={sendMessage}
          initialSuggestions={initialSuggestions}
          bottomRef={bottomRef}
      />
        
      </div>

       {/* Start Over Button */}
    {messages.length > 0 && (
      <div className="flex justify-end mt-2">
        <button
          onClick={resetChat}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
        >
          Start Over
        </button>
      </div>
    )}

      {showScrollButton && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={scrollToBottom}
            className="bg-[#f5694b] text-white px-4 py-2 rounded shadow hover:bg-[#e0583e] text-sm transition"
          >
            Catch Up
          </button>
        </div>
      )}

      

      <div className="flex mt-4">
        <input
          className="flex-1 border rounded-l-lg p-2"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="bg-[#f5694b] hover:bg-[#e0583e] text-white px-4 rounded-r-lg"
          onClick={() => sendMessage()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
