"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Showcase(): React.ReactElement {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative mb-24 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl ring-1 ring-white/10 backdrop-blur"
    >
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <h3 className="text-2xl font-semibold">See it in motion</h3>
          <p className="mt-3 text-white/70">
            A clean, kinetic layout that syncs to your words. Animate lines,
            highlight syllables, and keep the focus on the music.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="#get-started"
              className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-neutral-900 transition hover:bg-white/90"
            >
              Try it free
            </a>
            <a
              href="#templates"
              className="inline-flex items-center justify-center rounded-md border border-white/15 bg-transparent px-4 py-2 text-white/90 transition hover:bg-white/10"
            >
              Browse templates
            </a>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <VideoMock />
        </div>
      </div>
    </motion.section>
  );
}

function VideoMock(): React.ReactElement {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/60 p-4 ring-1 ring-white/10">
      {/* Window bar */}
      <div className="mb-3 flex items-center gap-1">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        <div className="ml-auto h-2 w-24 rounded bg-white/10" />
      </div>
      {/* Video frame */}
      <div className="aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-[linear-gradient(135deg,#0b0b0b,40%,#141414,60%,#0b0b0b)]">
        <div className="relative h-full w-full">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            className="absolute inset-x-0 top-1/4 flex items-end justify-center gap-1"
          >
            {Array.from({ length: 60 }).map((_, index) => (
              <motion.span
                key={index}
                className="block w-1 rounded-full bg-gradient-to-t from-fuchsia-500/70 via-purple-500/70 to-indigo-500/70"
                style={{
                  height: `${Math.max(8, (Math.sin(index) + 1) * 16)}px`,
                }}
                animate={{
                  scaleY: [0.8, 1.4, 0.8],
                }}
                transition={{
                  duration: 2.4,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: (index % 7) * 0.08,
                }}
              />
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
            className="absolute bottom-8 left-1/2 w-[80%] -translate-x-1/2 text-center"
          >
            <p className="text-balance text-xl font-medium tracking-wide text-white">
              I could write a lyric video in my sleep tonight
            </p>
            <div className="mx-auto mt-3 h-1 w-40 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
          </motion.div>
        </div>
      </div>
      <motion.div
        initial={{ width: "0%" }}
        whileInView={{ width: "66%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10"
      >
        <div className="h-full w-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500" />
      </motion.div>
    </div>
  );
}
