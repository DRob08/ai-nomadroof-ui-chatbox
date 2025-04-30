export interface PropertyModel {
    post_title: string;
    half_property_url: string;
    full_thumbnail_url?: string;
    property_size?: string;
    property_rooms?: string;
    property_bedrooms?: string;
    property_bathrooms?: string;
    property_address?: string;
    property_state?: string;
    property_county?: string;
    property_country?: string;
    property_latitude?: string;
    property_longitude?: string;
    property_available_days?:string;
    property_booking_dates?:string;
    guest_no?: string;
    property_price?: string;
    property_price_per_month?: string;
    uni_nearby?: string;
    about_neighborhood?: string;
    cancellation_policy?: string;
    property_admin_area?: string;
    owner_name?: string;
    owner_first_name?: string;
    bedroom_descr?: string;
  
    electricity_included?: boolean;
    pool?: boolean;
    water_included?: boolean;
    gym?: boolean;
    heating?: boolean;
    hot_tub?: boolean;
    air_conditioning?: boolean;
    free_parking_on_premises?: boolean;
    desk?: boolean;
    hangers?: boolean;
    closet?: boolean;
    iron?: boolean;
  }
  