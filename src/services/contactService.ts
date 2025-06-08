// src/services/contactService.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export interface ContactFormData {
  name: string;
  email: string;
  whatsapp: string;
  message: string;
}

export const submitContactForm = async (formData: ContactFormData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/contact`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.detail) {
      throw new Error(error.response.data.detail);
    } else {
      throw new Error("Failed to submit contact form");
    }
  }
};
