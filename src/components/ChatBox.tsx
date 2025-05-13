import React, { JSX, useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Message } from '../types/chat';
import { getProperties } from '../services/propertyService';
import { getPropertyInsights } from '../services/aiService';
import { PropertyModel } from '../types/property';
import { Range, getTrackBackground } from 'react-range';
import PriceRangeSelector from './PriceRangeSelector'; // Import from the same folder
import PropertyCard from './PropertyCard'; // Import from the same folder
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';
import { Console } from 'console';

const MIN = 0;
const MAX = 1000;
const STEP = 10;

const initialSuggestions = [
  'Search for properties in Lima',
  'Print receipt for my booking',
  'Show me exclusive Properties only',
];

const suggestedQuestions = [
  "Which Distrcit has the most listings?",
  "What is the average price of properties?",
  "Which listings have pools or gyms?",
  "What Properties are close to PUCP and within how many km?",
];

type ChatStep = null | 'district' | 'date' | 'confirmDates' | 'price' | 'done' | 'propertyInsights';

// const districtOptions = [
//   { name: 'Miraflores', lat: -12.1211, lng: -77.0297 },
//   { name: 'Barranco', lat: -12.1449, lng: -77.0202 },
//   { name: 'San Isidro', lat: -12.0972, lng: -77.0369 },
//   { name: 'Surco', lat: -12.1586, lng: -76.9986 },
//   { name: 'La Molina', lat: -12.0909, lng: -76.9350 },
// ];


const districtOptions = [
  { name: 'Miraflores', lat: -12.1211, lng: -77.0297 },
  { name: 'Barranco', lat: -12.1449, lng: -77.0202 },
  { name: 'San Isidro', lat: -12.0972, lng: -77.0369 },
  { name: 'La Molina', lat: -12.0909, lng: -76.9350 },
  { name: 'Lince', lat: -12.0853, lng: -77.0342 },
  { name: 'Jesús María', lat: -12.0800, lng: -77.0431 },
];


const ChatBox: React.FC = () => {
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
    endDate:string;
  }>(null);
  const [resetComplete, setResetComplete] = useState(false);

  const formatDateRange = (startMonth: number, endMonth: number): string => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const year = currentMonth > startMonth ? currentYear + 1 : currentYear;
    const start = new Date(year, startMonth - 1, 1);
    const end = new Date(year, endMonth, 0);

    const format = (d: Date) => d.toLocaleDateString('en-CA');
    return `${format(start)} to ${format(end)}`;
  };

  const handleDateSelection = (range: 'spring' | 'fall') => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const [startMonth, endMonth] = range === 'spring' ? [3, 7] : [8, 12];
    const isPast = currentMonth > startMonth;
    const year = isPast ? currentYear + 1 : currentYear;
    const dateRange = formatDateRange(startMonth, endMonth);

    const start = new Date(year, startMonth - 1, 1);
    const end = new Date(year, endMonth, 0);

    const format = (d: Date) => d.toLocaleDateString('en-CA');

    if (isPast) {
      //setAwaitingDateConfirmation({ range, proposedDateRange: dateRange });
      setAwaitingDateConfirmation({
        range,
        proposedDateRange: `${format(start)} to ${format(end)}`,
        startDate: format(start),
        endDate: format(end),
      });
    
      addAssistantMessageOnly(
        `It looks like the ${range === 'spring' ? 'March to July' : 'August to December'} semester is in the past for this year. Did you mean to plan for ${year}?`
      );
      
      return;
    }

    setBookingDetails(prev => ({
      ...prev,
      startDate: format(start),
      endDate: format(end),
      dates: dateRange,
    }));
    
    setChatStep('price');
    addAssistantMessage(
      range === 'spring' ? 'March to July' : 'August to December' ,
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
    });
    setPriceRange([400, 600]);
    setLatestInsight(null);
    setProperties([]);
    setLoading(true);
    setIsTyping(false);
    setSearchResults([]);
    setShowProperties(false);
    setAwaitingDateConfirmation(null);

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
  
  const handleSuggestedQuestion = async (question: string) => {
    setChatStep('propertyInsights');
  
    try {
      const insightResponse = await getPropertyInsights(question, properties);
  
      addAssistantMessage(question, insightResponse.answer || 'No insight available.');
  
      // Scroll to bottom after a slight delay to let React render the new message
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      addAssistantMessage(question, 'Something went wrong fetching insights.');
  
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
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

    setBookingDetails(prev => ({
      ...prev,
      district: district.name,
      districtCoordinates: { lat: district.lat, lng: district.lng },
    }));
    setChatStep('date');

   /*  setMessages(prev => [
      ...prev,
      { role: 'user', content: district.name },
      {
        role: 'assistant',
        content: `Perfect! Let’s move on. Please select your desired date range:`,
      },
    ]); */
    addAssistantMessage(
       district.name ,
      `Perfect! Let’s move on. Please select your desired date range:`
    );
  };

  const sendMessage = async (content?: string) => {
    const messageText = content ?? input.trim();
    if (!messageText) return;

    const userMsg: Message = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    if (awaitingDateConfirmation) {
      const answer = messageText.toLowerCase();
      if (answer.includes('yes') || answer.includes('correct')) {
        setBookingDetails(prev => ({
          ...prev,
          dates: awaitingDateConfirmation.proposedDateRange,
          startDate: awaitingDateConfirmation.startDate,
          endDate: awaitingDateConfirmation.startDate
          //need to update dates here start and end date

        }));
        setAwaitingDateConfirmation(null);
        setChatStep('price');
      
        addAssistantMessageOnly('Thanks for confirming! What is your preferred price range? (e.g. $50–$100)');
        return;
      } else {
        setAwaitingDateConfirmation(null);
       
        addAssistantMessageOnly('No problem. Please select a different date range:');
        return;
      }
    }

   /*  if (chatStep === 'price') {
      const updatedBookingDetails = {
        ...bookingDetails,
        priceRange: messageText,
      };
      setBookingDetails(updatedBookingDetails);
      setChatStep('done');
    
      addAssistantMessageOnly(
        `Thanks! Here's what I found based on your criteria:\n\n📍 Location: ${updatedBookingDetails.city}, ${updatedBookingDetails.district}\n📅 Dates: ${updatedBookingDetails.dates}\n💵 Price Range: ${updatedBookingDetails.priceRange}\n\n(Showing search results...)`
      );
    
      const fetchProperties = async () => {
        try {
          setLoading(true);
          const response = await getProperties({
            city: updatedBookingDetails.city,
            district: updatedBookingDetails.district,
            dates: updatedBookingDetails.dates,
            startDate:updatedBookingDetails.startDate,
            endDate:updatedBookingDetails.endDate,
            priceRange: updatedBookingDetails.priceRange,
            districtCoordinates : updatedBookingDetails.districtCoordinates,
          });
          setProperties(response);
        } catch (error) {
          console.error('Error fetching properties:', error);
        } finally {
          setLoading(false);
        }
      };
    
      fetchProperties();
      return;
    } */
    
    
    if (messageText.toLowerCase().includes('properties in lima')) {
      setBookingDetails({
        city: 'Lima',
        district: '',
        districtCoordinates: { lat: 0, lng: 0 },
        dates: '',
        startDate: '',
        endDate: '',
        priceRange: '',
        minPrice:'',
        maxPrice:'',
      });
      setChatStep('district');
      addAssistantMessageOnly(
        `Which district in Lima are you most interested in?`
      );
      return;
    }

    // Fallback API call
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await res.json();
      const assistantMsg: Message = { role: 'assistant', content: data.reply };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('API error:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Error talking to AI 😞' },
      ]);
    }
  };

  const handleQuickResponse = (response: 'yes' | 'no') => {
    sendMessage(response);
  };

  const handleStartPriceSelection = () => {
    setChatStep('price');
  };

  const handleConfirmPrice = () => {
    const updatedBookingDetails = {
      ...bookingDetails,
      minPrice: pricesRange[0].toString(),
      maxPrice: pricesRange[1].toString(),
      priceRange: `${pricesRange[0]}-${pricesRange[1]}`,
    };
  
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
          // const noResultsSuggestions: Message = {
          //   role: 'assistant',
          //   type: 'suggestions',
          //   content: 'Here are a few ways you could adjust your search:',
          //   data: [
          //     'Try a different district',
          //     'Increase your max price',
          //     'Change your dates to include weekdays',
          //     'Search all of the city instead of a specific area',
          //   ],
          // };

          const noResultsSuggestions: Message = {
            role: 'assistant',
            type: 'flowSuggestions', // <-- changed from 'suggestions'
            content: 'Here are a few ways you could adjust your search:',
            data: [
              'Try a different district',
              'Increase your max price',
              'Change your dates to include weekdays',
              'Search all of the city instead of a specific area',
            ],
          };
          
          
          const noResultsText: Message = {
            role: 'assistant',
            type: 'text',
            content: `Hmm, I couldn't find any properties that match your criteria right now.\n\nYou might want to try expanding your search area, increasing your price range, or changing the dates.`,
          };
          
          setMessages(prev => [...prev, noResultsText, noResultsSuggestions]);
          
          return;
        }
  
        addAssistantMessageOnly(`Here are ${response.length} properties based on your criteria:`);
        console.log(response)
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
        addAssistantMessageOnly(`Oops! Something went wrong while searching. Please try again in a moment.`);
      } finally {
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
  
  
 const containerRef = useRef<HTMLDivElement>(null);

 const [isAtBottom, setIsAtBottom] = useState(true); // Track if the user is at the bottom

 useEffect(() => {
  if (messages.length > 5) {
    if (isAtBottom && containerRef.current && bottomRef.current) {

      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {

      if (!isAtBottom) console.log('   - User is not at bottom');
      if (!containerRef.current) console.log('   - containerRef is null');
      if (!bottomRef.current) console.log('   - bottomRef is null');
    }
  } else {
    console.log('🔕 Not enough messages to scroll (<= 5)');
  }
}, [messages, isAtBottom]);


  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      setIsAtBottom(scrollTop + clientHeight === scrollHeight);
    }
  };

  // Add a scroll event listener to handle checking if at the bottom
  useEffect(() => {
    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { role: 'assistant', content: 'Hi! What can I help you with today?' },
      ]);
    }
  }, []);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={scrollContainerRef}  className="flex flex-col h-screen p-4 relative">
         {/*    <div ref={scrollContainerRef} /> */}
      <div ref={containerRef} className="flex-1 overflow-y-auto space-y-4 pr-4 scrollbar-thin scrollbar-thumb-gray-400">

          <>
           {messages.map((msg, i) => (
              <MessageItem key={i} msg={msg} 
              handleSuggestedQuestion={handleSuggestedQuestion}
              handleSuggestionClick={handleSuggestionClick}
               />
            ))}

{messages.length > 0 && (
  <button
    onClick={resetChat}
    className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 text-sm rounded hover:bg-red-600 shadow-md z-10"
  >
    Start Over
  </button>
)}

            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {initialSuggestions.map((text, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(text)}
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

          {chatStep === 'price' && !isTyping && (
            <PriceRangeSelector
            pricesRange={pricesRange}
            setPriceRange={setPriceRange}
            handleConfirmPrice={handleConfirmPrice}
          />
          )}

            {awaitingDateConfirmation && !isTyping  &&  (
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
