import type { Metadata } from "next";

export const SITE_URL = "https://www.sonexa.cc";
export const DEFAULT_TITLE = "Sonexa — AI Lyric Video Maker & Caption Studio";
export const DEFAULT_DESCRIPTION =
  "Upload a song or clip and get on-beat, styled words. Edit timing, position, and styles; export for TikTok, Reels, and YouTube.";

export function absoluteUrl(path: string = "/"): string {
  if (!path) return SITE_URL;
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

type SiteMetaArgs = {
  title?: string;
  description?: string;
  path?: string;
  imageUrl?: string;
  noIndex?: boolean;
};

export function siteMeta(args: SiteMetaArgs = {}): Metadata {
  const title = args.title ?? DEFAULT_TITLE;
  const description = args.description ?? DEFAULT_DESCRIPTION;
  const path = args.path ?? "/";
  const url = absoluteUrl(path);
  const image =
    args.imageUrl ??
    `${SITE_URL}/api/og?title=${encodeURIComponent(
      title
    )}&desc=${encodeURIComponent(description)}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      siteName: "Sonexa",
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: args.noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
        }
      : {
          index: true,
          follow: true,
        },
  } satisfies Metadata;
}

// JSON-LD builders
type WithContext<T> = T & { "@context": "https://schema.org" };

export function softwareApplicationLd(): WithContext<{
  "@type": "SoftwareApplication";
  name: string;
  applicationCategory: string;
  operatingSystem: string;
  url: string;
  offers: { "@type": "Offer"; price: string; priceCurrency: string }[];
}> {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Sonexa",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    offers: [
      { "@type": "Offer", price: "9.99", priceCurrency: "USD" },
      { "@type": "Offer", price: "19.99", priceCurrency: "USD" },
      { "@type": "Offer", price: "39.99", priceCurrency: "USD" },
    ],
  };
}

export function faqPageLd(
  faqs: Array<{ question: string; answer: string }>
): WithContext<{
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: { "@type": "Answer"; text: string };
  }>;
}> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function howToLd(args: {
  name: string;
  description?: string;
  steps: string[];
}): WithContext<{
  "@type": "HowTo";
  name: string;
  description?: string;
  step: Array<{ "@type": "HowToStep"; name: string; text: string }>;
}> {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: args.name,
    description: args.description,
    step: args.steps.map((s) => ({ "@type": "HowToStep", name: s, text: s })),
  };
}

export function breadcrumbLd(
  items: Array<{ name: string; path: string }>
): WithContext<{
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function videoObjectLd(args: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  contentUrl?: string;
  embedUrl?: string;
}): WithContext<{
  "@type": "VideoObject";
  name: string;
  description: string;
  thumbnailUrl: string[];
  uploadDate: string;
  duration?: string;
  contentUrl?: string;
  embedUrl?: string;
}> {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: args.name,
    description: args.description,
    thumbnailUrl: [args.thumbnailUrl],
    uploadDate: args.uploadDate,
    duration: args.duration,
    contentUrl: args.contentUrl,
    embedUrl: args.embedUrl,
  };
}
