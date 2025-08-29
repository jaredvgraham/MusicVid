"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

function EqStyles(): React.ReactElement {
  return (
    <style jsx global>{`
      .eq-hero {
        display: inline-flex;
        align-items: flex-end;
        gap: 6px;
        height: 16px;
        width: 100%;
        justify-content: space-between;
      }
      .eq-hero-bar {
        width: 4px;
        height: 12px;
        border-radius: 9999px;
        background: linear-gradient(
          180deg,
          rgba(240, 171, 252, 0.95),
          rgba(129, 140, 248, 0.95)
        );
        transform-origin: bottom;
        animation: eqPulse 1.2s ease-in-out infinite;
      }
      @keyframes eqPulse {
        0% {
          transform: scaleY(0.4);
        }
        25% {
          transform: scaleY(1);
        }
        50% {
          transform: scaleY(0.6);
        }
        75% {
          transform: scaleY(0.9);
        }
        100% {
          transform: scaleY(0.4);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .eq-hero-bar {
          animation: none;
        }
      }
    `}</style>
  );
}

export default function UploadCta(): React.ReactElement {
  return (
    <div className="relative py-20 overflow-hidden">
      {/* Background elements - simplified */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(139,92,246,0.04),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Create Your
            <span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              Masterpiece
            </span>
            ?
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Join thousands of creators who are already making stunning lyric
            videos
          </p>
        </motion.div>

        {/* Main CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          {/* Main CTA card */}
          <div className="relative">
            {/* Layered background effects - simplified */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-3xl transform rotate-1" />

            {/* Main content */}
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm border border-white/20 rounded-3xl p-12 shadow-2xl">
              {/* Audio visualization */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="flex justify-center mb-8"
              >
                <div className="relative">
                  <div className="eq-hero">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <span
                        key={i}
                        className="eq-hero-bar"
                        style={{ animationDelay: `${(i % 5) * 0.12}s` }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Main CTA content */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-500 shadow-lg mb-6"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    width="32"
                    height="32"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                  </svg>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
                  className="text-3xl font-bold text-white mb-4"
                >
                  Create Your Lyric Video
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
                  className="text-lg text-white/70 mb-8 max-w-lg mx-auto"
                >
                  Start a new project and upload your song for AI lyric timing
                  on the next page. Transform your music into captivating visual
                  experiences.
                </motion.p>

                {/* Feature highlights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 1 }}
                  className="flex flex-wrap justify-center gap-6 mb-8"
                >
                  <div className="flex items-center gap-2 text-white/60">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-sm">AI-Powered Timing</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-sm">Professional Templates</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <div className="w-2 h-2 bg-fuchsia-400 rounded-full"></div>
                    <span className="text-sm">Export to All Platforms</span>
                  </div>
                </motion.div>
              </div>

              {/* CTA button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 1.2 }}
                className="flex justify-center"
              >
                <Link
                  href="/upload"
                  className="group relative inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:shadow-2xl hover:shadow-fuchsia-500/25 hover:scale-105"
                >
                  <span>Get Started</span>
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h14M13 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
