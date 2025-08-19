"use client";

import React from "react";
import Head from "next/head";
import { absoluteUrl } from "@/lib/seo";

type SeoHeadProps = {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  canonical?: string;
};

export default function SeoHead(props: SeoHeadProps): React.ReactElement {
  const title = props.title;
  const description = props.description;
  const canonical = props.canonical ?? absoluteUrl(props.path ?? "/");
  const ogImage = props.ogImage;
  return (
    <Head>
      {title ? <title>{title}</title> : null}
      {description ? <meta name="description" content={description} /> : null}
      <link rel="canonical" href={canonical} />
      {ogImage ? <meta property="og:image" content={ogImage} /> : null}
      {title ? <meta property="og:title" content={title} /> : null}
      {description ? (
        <meta property="og:description" content={description} />
      ) : null}
      <meta property="og:url" content={canonical} />
      <meta name="twitter:card" content="summary_large_image" />
      {title ? <meta name="twitter:title" content={title} /> : null}
      {description ? (
        <meta name="twitter:description" content={description} />
      ) : null}
      {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}
    </Head>
  );
}
