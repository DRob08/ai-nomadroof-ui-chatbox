import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getFAQAnswer = async (question: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/agent/faq-match`, {
      params: { q: question },
    });
    return response.data;
  } catch (error) {
    console.error('FAQ Match Error:', error);
    throw error;
  }
};
