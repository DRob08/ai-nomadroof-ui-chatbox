import axios from 'axios';
import { ReceiptModel } from '../types/receipt';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getReceipt = async (booking_id: string, email: string): Promise<ReceiptModel> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/receipts`, {
      params: { booking_id, email },
    });
    return response.data;
  } catch (error) {
    console.error('Receipt Fetch Error:', error);
    throw error;
  }
};
