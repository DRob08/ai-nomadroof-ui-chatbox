// src/utils/ga.ts

const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID || '';

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void; // gtag is optional
  }
}

export const loadGA = () => {
  return new Promise<void>((resolve) => {
   // const GA_MEASUREMENT_ID = 'G-4KQV0SXX8Z';
    console.log('GA ID:', GA_MEASUREMENT_ID);

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    script.onload = () => {
      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args: any[]) {
        (window as any).dataLayer.push(args);
      }

      (window as any).gtag = gtag;
      gtag('js', new Date());
      gtag('config', GA_MEASUREMENT_ID, {
        send_page_view: false, // prevent auto pageview if you're handling manually
      });

      resolve();
    };

    document.head.appendChild(script);
  });
};

export const pageview = (url: string) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: url,
    });
  } else {
    console.warn('gtag not defined');
  }
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
