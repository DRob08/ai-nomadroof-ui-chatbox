// src/services/propertyService.ts
import axios from 'axios';
import { PropertyModel } from '../types/property';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getProperties = async (): Promise<PropertyModel[]> => {
  const response = await axios.get(`${API_BASE_URL}/property/properties`);
  return response.data;
};

export const getPropertyInsights = async (question: string, properties: PropertyModel[]) => {
    const response = await axios.post(`${API_BASE_URL}/agent/property-insight`, {
      question,
      properties,
    });
    return response.data;
  };
