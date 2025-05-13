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
    property_district,
    property_state,
    property_country,
    electricity_included,
    is_prop_featured,
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
    about_neighborhood,
    half_property_url,
  } = property;

  const addressCityOnly = property.property_address?.split(",").slice(1).join(",").trim();

  const location = [property_district, property_state, property_country].filter(Boolean).join(', ');

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
    <div className="relative bg-white border border-gray-200 shadow-md rounded-2xl p-4 space-y-2 hover:shadow-lg transition duration-300">
      
      <a href={`https://www.nomadroof.com/properties/${half_property_url}`} target="_blank" rel="noopener noreferrer" className="block relative">
        {is_prop_featured && (
          <div className="absolute top-2 left-2 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow-md z-10">
            Featured
          </div>
        )}
        <img
          src={full_thumbnail_url || '/default-thumbnail.jpg'}
          alt={post_title}
          className="rounded-xl w-full h-48 object-cover mb-2"
        />
      </a>

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
