"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ExplainerCaptions(): React.ReactElement {
  const bullets = [
    { t: "Auto‑transcribe", d: "Clean words, smart punctuation" },
    { t: "Karaoke highlights", d: "Per‑word emphasis on beat" },
    { t: "Readable everywhere", d: "Outline • background • baseline" },
    { t: "Brandable", d: "Fonts • colors • motion presets" },
  ];
  return (
    <section
      aria-label="Caption generator explainer"
      className="relative mb-12 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10"
    >
      <div className="mx-auto grid max-w-5xl items-center gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            {bullets.map((b, i) => (
              <motion.div
                key={b.t}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                  delay: i * 0.05,
                }}
                className="rounded-xl border border-white/10 bg-black/30 p-4"
              >
                <h3 className="text-base font-semibold text-white">{b.t}</h3>
                <p className="mt-1 text-sm text-white/70">{b.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40 p-4">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center"
          >
            <p className="text-balance text-lg text-white/90">
              Add captions that match your vibe.
            </p>
            <div className="mx-auto mt-3 flex w-max items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80">
              <span>Minimal</span>
              <span>•</span>
              <span>Bold</span>
              <span>•</span>
              <span>Neon</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
