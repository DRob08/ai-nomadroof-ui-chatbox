export interface Message {
  role: 'assistant' | 'user';
  content: string;
  type?: 'text' | 'properties' | 'insight' | 'suggestions';
  data?: any; // can be strongly typed later
}
