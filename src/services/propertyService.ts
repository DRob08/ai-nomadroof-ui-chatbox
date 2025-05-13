// src/services/propertyService.ts
import axios from 'axios';
import { PropertyModel } from '../types/property';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/* export const getProperties = async (): Promise<PropertyModel[]> => {
  const response = await axios.get(`${API_BASE_URL}/property/properties`);
  return response.data;
}; */

export const getProperties = async (filters?: {
  city?: string;
  district?: string;
  dates?: string;
  startDate?: string;
  endDate?: string;
  priceRange?: string;
  districtCoordinates?: {
    lat: number;
    lng: number;
  };
  minPrice?:string;
  maxPrice?:string;
}): Promise<PropertyModel[]> => {
  const params = new URLSearchParams();

  if (filters?.city) params.append('city', filters.city);
  if (filters?.district) params.append('district', filters.district);
  if (filters?.dates) params.append('dates', filters.dates);
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);
  if (filters?.priceRange) params.append('priceRange', filters.priceRange);
  if (filters?.minPrice) params.append('minPrice', filters.minPrice);
  if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice);


  if (filters?.districtCoordinates) {
    params.append('districtLat', filters.districtCoordinates.lat.toString());
    params.append('districtLng', filters.districtCoordinates.lng.toString());
  }

  const queryString = params.toString();
  const url = `${API_BASE_URL}/property/properties${queryString ? `?${queryString}` : ''}`;

  const response = await axios.get(url);
  return response.data;
};


export const getPropertyInsights = async (question: string, properties: PropertyModel[]) => {
    const response = await axios.post(`${API_BASE_URL}/agent/property-insight`, {
      question,
      properties,
    });
    return response.data;
  };

  export const getAvailableExclusiveProperties = async (): Promise<PropertyModel[]> => {
    const url = `${API_BASE_URL}/property/exclusive-properties`;
    const response = await axios.get(url);
    return response.data;
  };
  
