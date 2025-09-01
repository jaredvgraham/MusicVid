"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    fbq: any;
    ttq: any;
  }
}

interface PixelTrackerProps {
  facebookPixelId?: string;
  tiktokPixelId?: string;
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

// Initialize TikTok Pixel with official bootstrap
const initTikTokPixel = (pixelId: string) => {
  if (typeof window === "undefined") return;

  // Prevent multiple initializations
  if ((window as any).ttq?.loaded) return;

  (function (w: any, d: Document, t: string, u: string) {
    w.TiktokAnalyticsObject = t;
    const ttq = (w[t] = w[t] || []);
    ttq.methods = [
      "page",
      "track",
      "identify",
      "instances",
      "debug",
      "on",
      "off",
      "once",
      "ready",
      "setUserProperties",
      "setUserPropertiesOnce",
      "unsetUserProperties",
      "set",
      "reset",
    ];
    ttq.setAndDefer = function (t: any, e: any) {
      (t as any)[e] = function (...args: any[]) {
        (t as any).push([e].concat(args));
      };
    };
    for (let i = 0; i < ttq.methods.length; i++)
      ttq.setAndDefer(ttq, ttq.methods[i]);
    ttq.instance = function (t: any) {
      const e: any = ttq._i[t] || [];
      for (let n = 0; n < ttq.methods.length; n++)
        ttq.setAndDefer(e, ttq.methods[n]);
      return e;
    };
    ttq.load = function (e: string, n?: any) {
      const s = "https://analytics.tiktok.com/i18n/pixel/events.js";
      ttq._i = ttq._i || {};
      ttq._i[e] = [];
      ttq._i[e]._u = s;
      ttq._t = ttq._t || {};
      ttq._t[e] = +new Date();
      ttq._o = ttq._o || {};
      ttq._o[e] = n || {};
      const o = d.createElement("script");
      o.type = "text/javascript";
      o.async = true;
      o.src = s + "?sdkid=" + e + "&lib=" + t;
      const m = d.getElementsByTagName("script")[0];
      m.parentNode?.insertBefore(o, m);
    };
  })(
    window,
    document,
    "ttq",
    "https://analytics.tiktok.com/i18n/pixel/events.js"
  );

  (window as any).ttq.load(pixelId);
  (window as any).ttq.page();
  (window as any).ttq.loaded = true;
};

// Unified Pixel Tracker component
export default function PixelTracker({
  facebookPixelId,
  tiktokPixelId,
}: PixelTrackerProps) {
  useEffect(() => {
    if (facebookPixelId) {
      initFacebookPixel(facebookPixelId);
    }

    if (tiktokPixelId) {
      initTikTokPixel(tiktokPixelId);
    }
  }, [facebookPixelId, tiktokPixelId]);

  return null;
}

// Unified tracking functions that work for both pixels
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (typeof window === "undefined") return;

  // Facebook Pixel
  if ((window as any).fbq) {
    (window as any).fbq("track", eventName, parameters);
  }

  // TikTok Pixel
  if ((window as any).ttq) {
    // Convert Facebook parameters to TikTok format
    const tiktokParams = convertToTikTokFormat(parameters);
    const tiktokEventName = convertEventNameToTikTok(eventName);
    (window as any).ttq.track(tiktokEventName, tiktokParams);
  }
};

// Convert Facebook parameters to TikTok format
const convertToTikTokFormat = (parameters?: Record<string, any>) => {
  if (!parameters) return {};

  const converted: Record<string, any> = { ...parameters };

  // Convert content_ids array to contents array for TikTok
  if (parameters.content_ids && Array.isArray(parameters.content_ids)) {
    converted.contents = parameters.content_ids.map((id: string) => ({
      content_id: id,
      quantity: 1,
      price: parameters.value || 0,
    }));
    delete converted.content_ids;
  }

  // TikTok specific parameter conversions
  if (parameters.value) {
    converted.value = parameters.value;
  }
  if (parameters.currency) {
    converted.currency = parameters.currency;
  }
  if (parameters.content_type) {
    converted.content_type = parameters.content_type;
  }

  return converted;
};

// Convert Facebook event names to TikTok event names
const convertEventNameToTikTok = (eventName: string) => {
  const eventMap: Record<string, string> = {
    Purchase: "CompletePayment",
    InitiateCheckout: "InitiateCheckout",
    ViewContent: "ViewContent",
    AddToCart: "AddToCart",
    Lead: "Lead",
    CompleteRegistration: "CompleteRegistration",
    Subscribe: "Subscribe",
  };

  return eventMap[eventName] || eventName;
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
