"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ExplainerAddLyrics(): React.ReactElement {
  const steps = [
    {
      t: "Upload video + song",
      d: "Any camera, any audio",
      c: "from-sky-400 to-cyan-400",
    },
    {
      t: "Auto‑transcribe & sync",
      d: "Per‑word on‑beat",
      c: "from-fuchsia-400 to-indigo-400",
    },
    {
      t: "Drag to position",
      d: "Safe‑area aware",
      c: "from-emerald-400 to-teal-400",
    },
    {
      t: "Export formats",
      d: "9:16 • 16:9 • 1:1",
      c: "from-amber-400 to-rose-400",
    },
  ];

  return (
    <section
      aria-label="Add lyrics to footage"
      className="relative mb-12 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10"
    >
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
        <div className="space-y-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.t}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.06 }}
              className="rounded-xl border border-white/10 bg-black/30 p-4"
            >
              <h3 className="text-base font-semibold text-white">{s.t}</h3>
              <p className="mt-1 text-sm text-white/70">{s.d}</p>
              <span
                className={`mt-3 block h-1 w-24 rounded-full bg-gradient-to-r ${s.c}`}
              />
            </motion.div>
          ))}
        </div>
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40 p-4">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-balance text-center text-lg text-white/90"
          >
            Overlay on‑beat words exactly where you want them. Keep the vibe.
          </motion.p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {["Performance", "B‑roll", "Lyrics‑only"].map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-white/10 bg-white/10 px-2 py-1 text-center text-xs text-white/80"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
