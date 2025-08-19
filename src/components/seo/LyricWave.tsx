"use client";

import React from "react";
import { motion } from "framer-motion";

export default function LyricWave(): React.ReactElement {
  return (
    <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl ring-1 ring-white/10">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(135deg,#0b0b0b,40%,#141414,60%,#0b0b0b)]">
        {/* Waveform bars */}
        <div className="absolute inset-x-6 bottom-8 top-10 grid grid-cols-60 items-end gap-1">
          {Array.from({ length: 60 }).map((_, i) => (
            <motion.span
              key={i}
              className="block w-1 rounded-full bg-gradient-to-t from-emerald-400/70 via-teal-400/70 to-cyan-400/70"
              style={{ height: `${8 + ((i * 19) % 24)}px` }}
              animate={{ scaleY: [0.7, 1.25, 0.8] }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                delay: (i % 9) * 0.06,
              }}
            />
          ))}
        </div>
        {/* Lyric line reveal */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="absolute left-1/2 top-1/4 w-[80%] -translate-x-1/2 text-center"
        >
          <p className="text-balance text-xl font-medium tracking-wide text-white">
            Sing it back to me in neon light
          </p>
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "60%" }}
            transition={{
              duration: 1.1,
              ease: "easeOut",
              delay: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="mx-auto mt-3 h-1 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
          />
        </motion.div>
        {/* Playhead */}
        <motion.div
          initial={{ left: "10%" }}
          animate={{ left: ["10%", "90%"] }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          }}
          className="absolute bottom-6 top-6 w-0.5 bg-white/20"
        />
      </div>
    </div>
  );
}
