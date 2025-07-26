// src/utils/ga.ts

const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID || '';

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void; // gtag is optional
  }
}

export const loadGA = () => {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  // Prevent loading GA script multiple times
  if (document.querySelector(`script[src*="${GA_MEASUREMENT_ID}"]`)) {
    return;
  }

  // Create and insert the GA script tag
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize dataLayer if not already
  window.dataLayer = window.dataLayer || [];

  // Define gtag function that pushes to dataLayer
  window.gtag = function (...args: any[]) {
    window.dataLayer.push(args);
  };

  // Initialize gtag with current time and config
  window.gtag('js', new Date());

  // Disable automatic page_view, we will track manually
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false,
  });
};

export const pageview = (url: string) => {
  if (typeof window.gtag !== 'function' || !GA_MEASUREMENT_ID) return;

  window.gtag('event', 'page_view', {
    page_path: url,
    send_to: GA_MEASUREMENT_ID,
  });
};

export interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export const event = ({ action, category, label, value }: GAEvent) => {
  if (typeof window.gtag !== 'function') return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
};
