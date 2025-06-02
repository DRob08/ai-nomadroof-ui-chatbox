// src/components/ContactForm.tsx
import React, { useState } from "react";

const ContactForm = ({ onClose }: { onClose?: () => void }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    if (onClose) onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md space-y-4 w-full max-w-lg"
    >
      <h2 className="text-2xl font-bold text-[#f5694b]">Get in Touch</h2>
      <input
        name="name"
        type="text"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 rounded-lg px-4 py-2"
      />
      <input
        name="email"
        type="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 rounded-lg px-4 py-2"
      />
      <textarea
        name="message"
        placeholder="Your Message"
        value={formData.message}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 rounded-lg px-4 py-2 h-28"
      />
      <div className="flex justify-between items-center">
        <button
          type="submit"
          className="bg-[#f5694b] text-white px-6 py-2 rounded-full hover:bg-[#e2563e] transition"
        >
          Send
        </button>
        {onClose && (
          <button type="button" onClick={onClose} className="text-gray-500 hover:underline">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ContactForm;
