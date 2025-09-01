"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    fbq: any;
  }
}

interface FacebookPixelProps {
  pixelId: string;
}

// Initialize Facebook Pixel
const initFacebookPixel = (pixelId: string) => {
  if (typeof window === "undefined") return;

  // Prevent multiple initializations
  if (window.fbq && window.fbq._initialized) return;

  // Load Facebook Pixel script if not already loaded
  if (!window.fbq) {
    (function (f: any, b: any, e: any, v: any, n: any, t: any, s: any) {
      if (f.fbq) return;
      n = f.fbq = function (...args: any[]) {
        if (n.callMethod) {
          n.callMethod(...args);
        } else {
          n.queue.push(args);
        }
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      "script",
      "https://connect.facebook.net/en_US/fbevents.js",
      null,
      null,
      null
    );
  }

  // Initialize pixel
  window.fbq("init", pixelId);
  window.fbq("track", "PageView");
  window.fbq._initialized = true;
};

// Facebook Pixel component
export default function FacebookPixel({ pixelId }: FacebookPixelProps) {
  useEffect(() => {
    initFacebookPixel(pixelId);
  }, [pixelId]);

  return null;
}

// Utility functions for tracking events
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, parameters);
  }
};

// Common conversion events
export const trackPurchase = (
  value: number,
  currency: string = "USD",
  contentIds?: string[]
) => {
  trackEvent("Purchase", {
    value: value,
    currency: currency,
    content_ids: contentIds,
    content_type: "product",
  });
};

export const trackInitiateCheckout = (
  value: number,
  currency: string = "USD",
  contentIds?: string[]
) => {
  trackEvent("InitiateCheckout", {
    value: value,
    currency: currency,
    content_ids: contentIds,
    content_type: "product",
  });
};

export const trackAddToCart = (
  value: number,
  currency: string = "USD",
  contentIds?: string[]
) => {
  trackEvent("AddToCart", {
    value: value,
    currency: currency,
    content_ids: contentIds,
    content_type: "product",
  });
};

export const trackViewContent = (
  contentIds?: string[],
  contentType: string = "product"
) => {
  trackEvent("ViewContent", {
    content_ids: contentIds,
    content_type: contentType,
  });
};

export const trackLead = (value?: number, currency: string = "USD") => {
  trackEvent("Lead", {
    value: value,
    currency: currency,
  });
};

export const trackCompleteRegistration = () => {
  trackEvent("CompleteRegistration");
};

export const trackSubscribe = (value: number, currency: string = "USD") => {
  trackEvent("Subscribe", {
    value: value,
    currency: currency,
  });
};
