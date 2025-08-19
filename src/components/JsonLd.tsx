"use client";

import React from "react";
import Script from "next/script";

type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

export default function JsonLd({ data }: JsonLdProps): React.ReactElement {
  const nodes = Array.isArray(data) ? data : [data];
  return (
    <>
      {nodes.map((node, index) => (
        <Script id={`jsonld-${index}`} key={index} type="application/ld+json">
          {JSON.stringify(node)}
        </Script>
      ))}
    </>
  );
}
