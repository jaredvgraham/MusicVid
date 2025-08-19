"use client";

import React from "react";
import { motion } from "framer-motion";

export default function PhonePreview(): React.ReactElement {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl ring-1 ring-white/10">
        {/* Notch */}
        <div className="pointer-events-none absolute left-1/2 top-0 z-10 h-6 w-36 -translate-x-1/2 rounded-b-2xl bg-black" />
        {/* Gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_60%_at_20%_0%,rgba(99,102,241,.25),transparent),radial-gradient(120%_60%_at_80%_100%,rgba(236,72,153,.25),transparent)]" />
        {/* Animated caption bars */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4">
          {[
            "This beat hits way too hard",
            "Don’t blink or you’ll miss it",
            "Loop‑worthy hooks all night",
          ].map((line, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.2 }}
              className="w-full max-w-[85%] rounded-xl border border-white/10 bg-white/10 p-2 text-center text-sm text-white/90 backdrop-blur"
            >
              {line}
            </motion.div>
          ))}
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "70%" }}
            transition={{
              duration: 1.2,
              ease: "easeOut",
              repeat: Infinity,
              repeatType: "mirror",
            }}
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"
          >
            <div className="h-full w-full bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
