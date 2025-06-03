export interface Message {
  role: 'assistant' | 'user';
  content: string;
  type?: 'text' | 'properties' | 'insight' | 'suggestions' |'flowSuggestions' |'action';
  data?: any; // can be strongly typed later
}
