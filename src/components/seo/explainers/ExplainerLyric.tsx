"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ExplainerLyric(): React.ReactElement {
  const lines = [
    { k: "Upload song", s: "MP3 / WAV", c: "from-emerald-400 to-cyan-400" },
    {
      k: "Auto‑sync lyrics",
      s: "on beat",
      c: "from-fuchsia-400 to-indigo-400",
    },
    {
      k: "Style typography",
      s: "fonts • colors • motion",
      c: "from-amber-400 to-rose-400",
    },
    {
      k: "Export ready",
      s: "16:9 • 9:16 • 1:1",
      c: "from-sky-400 to-teal-400",
    },
  ];

  return (
    <section
      aria-label="How lyric videos work"
      className="relative mb-12 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/3 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>
      <div className="mx-auto grid max-w-4xl gap-4">
        {lines.map((line, i) => (
          <motion.div
            key={line.k}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.05 }}
            className="relative overflow-hidden rounded-xl border border-white/10 bg-black/30 p-4"
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 rounded-xl bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:12px_100%]" />
            </div>
            <p className="text-balance text-lg font-semibold text-white">
              {line.k}
            </p>
            <div className="mt-2 flex items-center gap-3 text-sm text-white/70">
              <span className="rounded-md border border-white/10 bg-white/10 px-2 py-0.5">
                {line.s}
              </span>
              <span
                className={`h-1 w-24 rounded-full bg-gradient-to-r ${line.c}`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
