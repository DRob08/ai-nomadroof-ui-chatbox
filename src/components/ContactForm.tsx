import React, { useState } from "react";
import { submitContactForm } from "../services/contactService";
import { event as trackEvent } from '../utils/ga';


const ContactForm = ({ onClose }: { onClose?: () => void }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidWhatsAppNumber = (number: string) => {
    const regex = /^\+\d{10,15}$/;
    return regex.test(number);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!isValidWhatsAppNumber(formData.whatsapp)) {
      setStatusType("error");
      setStatusMessage("Please enter a valid WhatsApp number (e.g. +1234567890).");
      trackEvent({
        action: 'invalid_whatsapp',
        category: 'Validation',
        label: formData.whatsapp,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await submitContactForm(formData);
      setStatusType("success");
      setStatusMessage("✅ Your message was sent successfully!");
      setFormData({ name: "", email: "", whatsapp: "", message: "" }); // reset form
      if (onClose) {
        setTimeout(() => onClose(), 2000); // auto-close after 2s if modal
      }
      trackEvent({
        action: 'submit_contact_form',
        category: 'Contact',
        label: formData.email,
      });
    } catch (error: any) {
      console.error("Error submitting contact form:", error);
      setStatusType("error");
      setStatusMessage(error.message || "Something went wrong.");
       trackEvent({
        action: 'submit_contact_form_failed',
        category: 'Contact',
        label: error.message || 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-center text-[#f5694b] mb-1">
        Join Our Global Community 🌍
      </h1>
      <p className="text-sm text-gray-600 text-center mb-4">
        Connect with us via WhatsApp or email — we’re here to help!
      </p>

      {statusMessage && (
        <div
          className={`text-sm mb-4 px-4 py-2 rounded ${
            statusType === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {statusMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="name"
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
        />
        <input
          name="email"
          type="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
        />
        <input
          name="whatsapp"
          type="tel"
          placeholder="WhatsApp Number (e.g. +1234567890)"
          value={formData.whatsapp}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 text-sm"
        />

        <div className="flex justify-between items-center pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#f5694b] text-white px-6 py-2 rounded-full hover:bg-[#e2563e] transition text-sm disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send"}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:underline text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
