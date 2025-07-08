// src/utils/chatUtils.ts

import { ChatProperty } from '../types/chat';

export function isChatPropertyArray(data: any): data is ChatProperty[] {
  return (
    Array.isArray(data) &&
    data.every((item) =>
      typeof item.title === 'string' &&
      (typeof item.price === 'number' || typeof item.price === 'string') &&
      typeof item.rooms === 'number' &&
      Array.isArray(item.amenities) &&
      typeof item.url === 'string' &&
      typeof item.location === 'object' &&
      typeof item.location.district === 'string' &&
      typeof item.location.city === 'string' &&
      typeof item.location.country === 'string'
    )
  );
}

export function sanitizeAnswer(answer: string): string {
  return answer
    .trim()
    .replace(/^```json/i, '')
    .replace(/^```/, '')
    .replace(/```$/, '')
    .trim();
}
