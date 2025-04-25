// src/services/aiService.ts
import axios from 'axios';
import { PropertyModel } from '../types/property';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getPropertyInsights = async (question: string, properties: PropertyModel[]) => {
  const response = await axios.post(`${API_BASE_URL}/agent/property-insight`, {
    question,
    properties,
  });
  return response.data;
};
