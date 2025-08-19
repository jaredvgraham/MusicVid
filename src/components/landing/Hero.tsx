"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Hero(): React.ReactElement {
  return (
    <section className="pt-2 pb-16 text-center sm:pt-2 md:pt-2">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur"
      >
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Instant lyric videos from any song
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        className="mx-auto mt-6 max-w-3xl bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-4xl font-semibold leading-tight text-transparent sm:text-5xl md:text-6xl"
      >
        AI Lyric Video Maker & Caption Studio
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.18 }}
        className="mx-auto mt-5 max-w-2xl text-balance text-white/70"
      >
        Upload a song or clip and get on‑beat, styled words. Edit timing,
        position, and styles; export for TikTok, Reels, and YouTube.
      </motion.p>
    </section>
  );
}
