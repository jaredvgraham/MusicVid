"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Hero(): React.ReactElement {
  return (
    <section className="relative pt-2 pb-16 overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut", delay: 1 }}
          className="absolute bottom-20 left-1/3 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-white/80 backdrop-blur">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span
                className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse"
                style={{ animationDelay: "0.2s" }}
              />
              <span
                className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
            <span className="font-medium">AI-Powered Lyric Videos</span>
          </div>
        </motion.div>

        {/* Main heading with split design */}
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-left"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-br from-white via-white to-white/80 bg-clip-text text-transparent">
                Create
              </span>
              <br />
              <span className="bg-gradient-to-br from-fuchsia-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Stunning
              </span>
              <br />
              <span className="bg-gradient-to-br from-white via-white to-white/80 bg-clip-text text-transparent">
                Lyric Videos
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="mt-6 text-xl text-white/70 leading-relaxed max-w-lg"
            >
              Transform any song into a captivating visual experience with
              AI-powered lyric timing, beautiful templates, and professional
              effects. From concept to completion in minutes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <div className="flex items-center gap-2 text-white/60">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-sm">95%+ AI Accuracy</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm">Export to All Platforms</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <div className="w-2 h-2 bg-fuchsia-400 rounded-full"></div>
                <span className="text-sm">Professional Templates</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="relative"
          >
            <div className="relative">
              {/* Main video mockup */}
              <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-neutral-900 to-black p-6 shadow-2xl">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="ml-auto h-2 w-32 rounded bg-white/10" />
                </div>

                <div className="aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900">
                  <div className="relative h-full w-full">
                    {/* Animated lyrics */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="text-center">
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.7, 1, 0.7],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="text-2xl font-bold text-white mb-2"
                        >
                          Lyric videos
                        </motion.div>
                        <motion.div
                          animate={{
                            scale: [1, 1.05, 1],
                            opacity: [0.8, 1, 0.8],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: 0.5,
                            ease: "easeInOut",
                          }}
                          className="text-lg text-white/80"
                        >
                          at the speed of sound
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Floating elements around the mockup */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <svg
                  className="w-8 h-8 text-white"
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
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: 1,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg"
              >
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
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
