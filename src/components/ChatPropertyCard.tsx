import React from 'react';
import { ChatProperty } from '../types/chat'; 

const ChatPropertyCard: React.FC<ChatProperty> = ({
  title,
  price,
  rooms,
  amenities,
  location,
  url,
}) => {
  return (
   
    <div className="w-full border border-gray-200 rounded-lg p-4 shadow-sm bg-white">

      <h3 className="font-semibold text-[#f5694b] text-lg mb-1">{title}</h3>
      <p className="text-sm text-gray-700 mb-1">
        📍 {location.district}, {location.city}, {location.country}
      </p>
      <p className="text-sm text-gray-800 mb-1">💵 ${price} / month</p>
      <p className="text-sm text-gray-600 mb-2">🛏️ {rooms} rooms</p>
      <div className="flex flex-wrap gap-1 text-xs text-gray-500 mb-2">
        {amenities.slice(0, 4).map((item, idx) => (
          <span key={idx} className="bg-gray-100 px-2 py-1 rounded">
            {item}
          </span>
        ))}
        {amenities.length > 4 && (
          <span className="text-gray-400 ml-1">+{amenities.length - 4} more</span>
        )}
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-white bg-[#f5694b] hover:bg-[#e0583e] px-3 py-1 rounded inline-block transition"
      >
        View Details
      </a>
    </div>
  );
};

export default ChatPropertyCard;
