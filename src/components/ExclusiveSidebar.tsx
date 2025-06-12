import React from "react";
import { PropertyModel } from "../types/property";

type Props = {
  properties: PropertyModel[];
};

const ExclusiveSidebar: React.FC<Props> = ({ properties }) => {
  return (
    <aside className="w-full md:w-64 md:h-screen md:sticky md:top-0 bg-white shadow-md p-4 overflow-y-auto md:border-r md:border-gray-200 border-none">

      <h2 className="text-lg font-semibold mb-4 text-gray-800">🌟 Exclusive Properties</h2>
      {properties.map((property) => (
        <div
          key={property.post_title}
          className="mb-4 bg-gray-100 rounded-xl shadow-sm p-2 hover:shadow-md transition"
        >
          <img
            src={property.full_thumbnail_url || "/images/placeholder.jpg"}
            alt={property.post_title}
            className="w-full h-28 object-cover rounded-lg mb-2"
          />
          <div>
            <h3 className="font-medium text-sm truncate">{property.post_title}</h3>
            <p className="text-xs text-gray-600">{property.property_address}</p>
            <p className="text-sm text-gray-800 mt-1">
              {property.property_price_per_month ? `Starting at $${property.property_price}/Month` : "Starting at "}
            </p>
            <a
              href={`https://www.nomadroof.com/properties/${property.half_property_url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-blue-600 text-xs hover:underline inline-block"
            >
              View →
            </a>
          </div>
        </div>
      ))}
    </aside>
  );
};

export default ExclusiveSidebar;
