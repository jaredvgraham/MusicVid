"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ExplainerTikTok(): React.ReactElement {
  const callouts = [
    { t: "Vertical‑first", d: "9:16 safe areas" },
    { t: "Beat‑aware", d: "karaoke mode" },
    { t: "Readable", d: "fast motion" },
    { t: "Trendy", d: "templates" },
  ];
  return (
    <section
      aria-label="TikTok captions explainer"
      className="relative mb-12 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10"
    >
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {callouts.map((c, i) => (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.06 }}
              className="rounded-xl border border-white/10 bg-black/30 p-4"
            >
              <h3 className="text-base font-semibold text-white">{c.t}</h3>
              <p className="mt-1 text-sm text-white/70">{c.d}</p>
            </motion.div>
          ))}
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
              Design for vertical, stay on the beat, and ship fast.
            </p>
            <div className="mx-auto mt-3 grid w-max grid-cols-2 gap-2 text-xs text-white/80">
              <span className="rounded-md border border-white/10 bg-white/10 px-2 py-1">
                9:16
              </span>
              <span className="rounded-md border border-white/10 bg-white/10 px-2 py-1">
                1:1
              </span>
              <span className="rounded-md border border-white/10 bg-white/10 px-2 py-1">
                16:9
              </span>
              <span className="rounded-md border border-white/10 bg-white/10 px-2 py-1">
                Templates
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
