export interface Message {
  role: 'assistant' | 'user';
  content: string;
  type?: 'text' | 'properties' | 'insight' | 'suggestions' |'flowSuggestions' |'action' |'chatProperties';
  data?: any; // can be strongly typed later
}

export interface ChatLocation {
  district: string;
  city: string;
  country: string;
}

export interface ChatProperty {
  title: string;
  price: number;
  rooms: number;
  amenities: string[];
  location: ChatLocation;
  url: string;
}

// src/types/chat.ts

export type ChatStep =
  | null
  | 'district'
  | 'date'
  | 'confirmDates'
  | 'price'
  | 'done'
  | 'propertyInsights';

