import { PropertyModel } from '../types/property';

const PropertyCard: React.FC<{ property: PropertyModel }> = ({ property }) => {
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
      about_neighborhood,  // New field added
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
  
        {about_neighborhood && (
          <p className="text-sm text-gray-600 mt-2">{about_neighborhood}</p>
        )}
  
        <div className="mt-2 flex flex-wrap gap-2">
          {amenities.map((a, index) => (
            <span key={index} className="flex items-center bg-gray-200 text-xs px-2 py-1 rounded-full">
              {a}
            </span>
          ))}
        </div>
      </div>
    );
  };
  export default PropertyCard;