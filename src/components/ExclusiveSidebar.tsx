// src/components/ExclusiveSidebar.tsx
import React from "react";

type Property = {
  id: string;
  name: string;
  image: string;
  price: string;
  location: string;
};

type Props = {
  properties: Property[];
};

const ExclusiveSidebar: React.FC<Props> = ({ properties }) => {
  return (
    <aside className="w-64 h-screen sticky top-0 bg-white shadow-md p-4 overflow-y-auto border-r border-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">🌟 Exclusive Stays</h2>
      {properties.map((property) => (
        <div
          key={property.id}
          className="mb-4 bg-gray-100 rounded-xl shadow-sm p-2 hover:shadow-md transition"
        >
          <img
            src={property.image}
            alt={property.name}
            className="w-full h-28 object-cover rounded-lg mb-2"
          />
          <div>
            <h3 className="font-medium text-sm truncate">{property.name}</h3>
            <p className="text-xs text-gray-600">{property.location}</p>
            <p className="text-sm text-gray-800 mt-1">{property.price}</p>
            <button className="mt-2 text-blue-600 text-xs hover:underline">
              View →
            </button>
          </div>
        </div>
      ))}
    </aside>
  );
};

export default ExclusiveSidebar;
