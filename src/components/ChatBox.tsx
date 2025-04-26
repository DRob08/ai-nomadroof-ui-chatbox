import React, { JSX, useEffect, useState } from 'react';
import { Message } from '../types/chat';
import {
  Bed,
  Bath,
  Wifi,
  Snowflake,
  Car,
  Tv,
  Coffee,
  Utensils,
  ShieldCheck,
  Sparkles,
  Anchor, // For ocean view or seaside related
  Sun, // For beachfront related
  MapPin, // For location related
  Heart, // For pet-friendly properties
  Shield, // For Security System
  Umbrella, // For Patio or outdoor features
  Bolt, // For electricity or power-related amenities
  Leaf, // For garden or eco-friendly properties
  Monitor, // For SmartTV or technology-related properties
} from 'lucide-react';
import { getProperties } from '../services/propertyService';
import { getPropertyInsights } from '../services/aiService';
import { PropertyModel } from '../types/property';

// Helper mapping of amenities to icons
const amenityIcons: { [key: string]: JSX.Element } = {
  Wifi: <Wifi className="w-4 h-4" />,
  AC: <Snowflake className="w-4 h-4" />,
  Parking: <Car className="w-4 h-4" />,
  TV: <Tv className="w-4 h-4" />,
  Breakfast: <Coffee className="w-4 h-4" />,
  Kitchen: <Utensils className="w-4 h-4" />,
  Security: <ShieldCheck className="w-4 h-4" />,
  Clean: <Sparkles className="w-4 h-4" />,
  Gym: <Bed className="w-4 h-4" />, // Using 'Bed' for Gym-related (alternatively could use a dumbbell if available)
  OceanView: <Anchor className="w-4 h-4" />,
  Beachfront: <Sun className="w-4 h-4" />,
  Location: <MapPin className="w-4 h-4" />,
  PetFriendly: <Heart className="w-4 h-4" />,
  SecuritySystem: <Shield className="w-4 h-4" />,
  Patio: <Umbrella className="w-4 h-4" />,
  Electricity: <Bolt className="w-4 h-4" />,
  Garden: <Leaf className="w-4 h-4" />,
  SmartTV: <Monitor className="w-4 h-4" />,
};


const initialSuggestions = [
  'Search for properties in Lima',
  'Print receipt for my booking',
  'Show me exclusive Properties only',
];

const suggestedQuestions = [
  "Which area has the most listings?",
  "What is the average price of properties?",
  "Which listings have pools or gyms?",
];

type ChatStep = null | 'district' | 'date' | 'confirmDates' | 'price' | 'done' | 'propertyInsights';

const districtOptions = [
  { name: 'Miraflores', lat: -12.1211, lng: -77.0297 },
  { name: 'Barranco', lat: -12.1449, lng: -77.0202 },
  { name: 'San Isidro', lat: -12.0972, lng: -77.0369 },
  { name: 'Surco', lat: -12.1586, lng: -76.9986 },
  { name: 'La Molina', lat: -12.0909, lng: -76.9350 },
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
    priceRange: '',
  });

  const [latestInsight, setLatestInsight] = useState<string | null>(null);
  const [properties, setProperties] = useState<PropertyModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isTyping, setIsTyping] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [awaitingDateConfirmation, setAwaitingDateConfirmation] = useState<null | {
    range: 'spring' | 'fall';
    proposedDateRange: string;
  }>(null);

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

    if (isPast) {
      setAwaitingDateConfirmation({ range, proposedDateRange: dateRange });
     /*  setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `It looks like the ${range === 'spring' ? 'March to July' : 'August to December'} semester is in the past for this year. Did you mean to plan for ${year}?`,
        },
      ]); */
      addAssistantMessageOnly(
        `It looks like the ${range === 'spring' ? 'March to July' : 'August to December'} semester is in the past for this year. Did you mean to plan for ${year}?`
      );
      
      return;
    }

    setBookingDetails(prev => ({ ...prev, dates: dateRange }));
    setChatStep('price');
   /*  setMessages(prev => [
      ...prev,
      {
        role: 'user',
        content: range === 'spring' ? 'March to July' : 'August to December',
      },
      {
        role: 'assistant',
        content: 'Got it! What is your preferred price range? (e.g. $50–$100)',
      },
    ]); */
    addAssistantMessage(
      range === 'spring' ? 'March to July' : 'August to December' ,
     `Got it! What is your preferred price range? (e.g. $50–$100)`
   );
  };

  const handleSuggestedQuestion = async (question: string) => {
    setChatStep('propertyInsights');
  
    try {
      const insightResponse = await getPropertyInsights(question, properties);
      console.log(insightResponse.answer)
      addAssistantMessage(question, insightResponse.answer || 'No insight available.');
    } catch (err) {
      addAssistantMessage(question, 'Something went wrong fetching insights.');
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

  const PropertyCard: React.FC<{ property: any }> = ({ property }) => {
    const {
      post_title,
      full_thumbnail_url,
      property_price_per_month,
      property_rooms,
      property_bedrooms,
      property_bathrooms,
      property_address,
      property_state,
      property_country,
      electricity_included,
      pool,
      water_included,
      gym,
      heating,
      hot_tub,
      air_conditioning,
      free_parking_on_premises,
      desk,
      hangers,
      closet,
      iron,
    } = property;
  
    const location = [property_address, property_state, property_country].filter(Boolean).join(', ');
  
    const amenities: string[] = [];
    if (electricity_included) amenities.push('Electricity');
    if (pool) amenities.push('Pool');
    if (water_included) amenities.push('Water');
    if (gym) amenities.push('Gym');
    if (heating) amenities.push('Heating');
    if (hot_tub) amenities.push('Hot Tub');
    if (air_conditioning) amenities.push('Air Conditioning');
    if (free_parking_on_premises) amenities.push('Free Parking');
    if (desk) amenities.push('Desk');
    if (hangers) amenities.push('Hangers');
    if (closet) amenities.push('Closet');
    if (iron) amenities.push('Iron');
  
    return (
      <div className="bg-white border border-gray-200 shadow-md rounded-2xl p-4 space-y-2 hover:shadow-lg transition duration-300">
        <img
          src={full_thumbnail_url || '/default-thumbnail.jpg'}
          alt={post_title}
          className="rounded-xl w-full h-48 object-cover mb-2"
        />
        <h3 className="text-lg font-semibold mb-1">{post_title}</h3>
  
        <p className="text-sm text-gray-600">{location}</p>
        <p className="text-lg font-bold text-emerald-600">${property_price_per_month} / Month</p>
        <p className="text-sm mt-1">
          🛏 {property_bedrooms || 'N/A'} rooms &nbsp; 🚿 {property_bathrooms || 'N/A'} baths
        </p>
  
        <div className="mt-2 flex flex-wrap gap-2">
          {amenities.map((a: string, index: number) => (
            <span key={index} className="flex items-center bg-gray-200 text-xs px-2 py-1 rounded-full">
              {a}
            </span>
          ))}
        </div>
      </div>
    );
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

    if (chatStep === 'price') {
      setBookingDetails(prev => ({ ...prev, priceRange: messageText }));
      setChatStep('done');
    
      addAssistantMessageOnly(
        `Thanks! Here's what I found based on your criteria:\n\n📍 Location: ${bookingDetails.city}, ${bookingDetails.district}\n📅 Dates: ${bookingDetails.dates}\n💵 Price Range: ${messageText}\n\n(Showing search results...)`
      );
    
      const fetchProperties = async () => {
        try {
          setLoading(true);
          const results = await getProperties(); // no filters yet
          setProperties(results); // or setSearchResults if you want to keep them separate
        } catch (err) {
          console.error("Error fetching properties", err);
          addAssistantMessageOnly("Oops! There was a problem fetching the properties.");
        } finally {
          setLoading(false);
        }
      };
    
      fetchProperties();
      return;
    }
    
    if (messageText.toLowerCase().includes('properties in lima')) {
      setBookingDetails({
        city: 'Lima',
        district: '',
        districtCoordinates: { lat: 0, lng: 0 },
        dates: '',
        priceRange: '',
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

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { role: 'assistant', content: 'Hi! What can I help you with today?' },
      ]);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex-1 overflow-y-auto space-y-4 pr-4 scrollbar-thin scrollbar-thumb-gray-400">
          <>
          {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start space-x-2 ${
                  msg.role === 'assistant' ? '' : 'flex-row-reverse'
                }`}
              >
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
            ))}

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

            {isTyping && (
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200">
                  🤖
                </div>
                <div className="max-w-xs rounded-lg px-4 py-2 text-sm bg-gray-100 text-gray-800">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}

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

          {chatStep === 'done' && properties.length > 0 && (
            <>
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">Matching Properties</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                  {properties.map((property, index) => (
                    <PropertyCard key={property.half_property_url || index} property={property} />
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-md font-semibold mb-2">Quick Insights</h2>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestedQuestion(q)}
                      className="bg-[#f5694b]/10 hover:bg-[#f5694b]/20 text-sm text-[#f5694b] px-4 py-2 rounded-lg border border-[#f5694b]"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </>
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
          </>
        
      </div>

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
