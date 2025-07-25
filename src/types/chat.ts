// src/types/chat.ts
import { ReceiptModel } from '../types/receipt';

export interface Message {
  role: 'assistant' | 'user';
  content: string;
  type?: 'text' | 'properties' | 'insight' | 'suggestions' | 'flowSuggestions' | 'action' | 'chatProperties' | 'receipt'; // ✅ Add 'receipt'
  data?: any; // We'll refine the type below
}

export interface ReceiptMessage extends Message {
  type: 'receipt';
  data: ReceiptModel;
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
  | 'propertyInsights'
  | 'faqIntro'
  | 'moreInfo'
  | 'receipt_booking_id'  // 👈 new: step where user enters booking ID
  | 'receipt_email'
  | 'bookingInfo';       // 👈 new: step where user enters email



  // src/types/chat.ts (or similar)
export type AwaitingDateConfirmation = {
  range: 'spring' | 'fall';
  proposedDateRange: string;
  startDate: string;
  endDate: string;
} | null;


