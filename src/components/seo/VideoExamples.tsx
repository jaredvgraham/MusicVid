"use client";

import React from "react";
import Image from "next/image";
import { Play, ExternalLink } from "lucide-react";

interface VideoExample {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  aspectRatio?: "16:9" | "9:16" | "1:1";
}

interface VideoExamplesProps {
  title: string;
  subtitle?: string;
  examples: VideoExample[];
  className?: string;
}

export default function VideoExamples({
  title,
  subtitle,
  examples,
  className = "",
}: VideoExamplesProps): React.ReactElement {
  return (
    <section className={`mb-12 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        {subtitle && (
          <p className="mt-2 text-white/70 max-w-2xl mx-auto">{subtitle}</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {examples.map((example) => (
          <div
            key={example.id}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 transition hover:border-white/20 hover:bg-white/10"
          >
            {/* Video Preview */}
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              {example.thumbnailUrl ? (
                <Image
                  src={example.thumbnailUrl}
                  alt={example.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                  <Play className="h-12 w-12 text-white/40" />
                </div>
              )}

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Play className="h-8 w-8 text-white" fill="white" />
                </div>
              </div>

              {/* Duration Badge */}
              {example.duration && (
                <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                  {example.duration}
                </div>
              )}

              {/* Aspect Ratio Badge */}
              {example.aspectRatio && (
                <div className="absolute top-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                  {example.aspectRatio}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-white mb-2">{example.title}</h3>
              <p className="text-sm text-white/70 mb-3">
                {example.description}
              </p>

              {/* Action Button */}
              <a
                href={example.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm text-white/90 transition hover:bg-white/20"
              >
                <ExternalLink className="h-4 w-4" />
                Watch Example
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
