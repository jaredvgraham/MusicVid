"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Showcase(): React.ReactElement {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative py-20 overflow-hidden"
    >
      {/* Background elements - simplified */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.03),transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            See the
            <span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              Magic
            </span>{" "}
            in Action
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Experience the power of AI-powered lyric timing and professional
            video creation
          </p>
        </motion.div>

        {/* Interactive showcase grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Interactive demo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            <div className="space-y-6">
              {/* Feature highlights */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="group cursor-pointer"
              >
                <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-fuchsia-300 transition-colors duration-300">
                        Lightning Fast Processing
                      </h3>
                      <p className="text-white/70 group-hover:text-white/90 transition-colors duration-300">
                        AI analyzes your audio in seconds, providing precise
                        lyric timing and beat detection
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="group cursor-pointer"
              >
                <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                        Professional Templates
                      </h3>
                      <p className="text-white/70 group-hover:text-white/90 transition-colors duration-300">
                        Choose from hundreds of stunning templates designed for
                        maximum visual impact
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="group cursor-pointer"
              >
                <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300">
                        Multi-Platform Export
                      </h3>
                      <p className="text-white/70 group-hover:text-white/90 transition-colors duration-300">
                        Export optimized videos for TikTok, Instagram, YouTube,
                        and more with perfect aspect ratios
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                href="/upload"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-500 px-6 py-3 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-fuchsia-500/25 hover:scale-105"
              >
                Try it free
              </Link>
            </motion.div>
          </motion.div>

          {/* Right side - Simplified video mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="relative">
              {/* Main video mockup */}
              <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black p-8 shadow-2xl">
                {/* Window controls */}
                <div className="mb-6 flex items-center gap-2">
                  <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="ml-auto h-2 w-40 rounded bg-white/10" />
                </div>

                {/* Video frame with simplified content */}
                <div className="aspect-video w-full overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10">
                  <div className="relative h-full w-full">
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-purple-900/20 to-neutral-900" />

                    {/* Static lyrics - simplified */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="text-3xl font-bold text-white drop-shadow-lg">
                          Lyric videos
                        </div>
                        <div className="text-xl text-white/90 drop-shadow-lg">
                          at the speed of sound
                        </div>

                        {/* Progress bar */}
                        <div className="mx-auto h-1.5 w-4/5 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 rounded-full shadow-lg" />
                      </div>
                    </div>

                    {/* Simplified audio waveform */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-end gap-1">
                      {Array.from({ length: 12 }).map((_, index) => (
                        <div
                          key={index}
                          className="w-1 bg-gradient-to-t from-fuchsia-400 to-purple-400 rounded-full"
                          style={{
                            height: `${Math.max(
                              8,
                              (Math.sin(index * 0.5) + 1) * 16
                            )}px`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-3/4 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 shadow-lg" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
