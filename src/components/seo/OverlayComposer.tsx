"use client";

import React from "react";
import { motion } from "framer-motion";

export default function OverlayComposer(): React.ReactElement {
  return (
    <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl ring-1 ring-white/10">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(135deg,#0b0b0b,40%,#141414,60%,#0b0b0b)]">
        {/* Rule of thirds grid */}
        <GridLines />

        {/* Moving lyric box to suggest drag/position */}
        <LyricBox />

        {/* Progress bar */}
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: ["0%", "75%", "40%", "90%"] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
          className="absolute bottom-5 left-1/2 h-1 -translate-x-1/2 overflow-hidden rounded-full bg-white/10"
          style={{ width: "60%" }}
        >
          <div className="h-full w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
        </motion.div>
      </div>
    </div>
  );
}

function GridLines(): React.ReactElement {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* vertical thirds */}
      <div className="absolute inset-y-0 left-1/3 w-px bg-white/10" />
      <div className="absolute inset-y-0 left-2/3 w-px bg-white/10" />
      {/* horizontal thirds */}
      <div className="absolute inset-x-0 top-1/3 h-px bg-white/10" />
      <div className="absolute inset-x-0 top-2/3 h-px bg-white/10" />
    </div>
  );
}

function LyricBox(): React.ReactElement {
  return (
    <motion.div className="absolute inset-0">
      <CaptionLane
        top="35%"
        speed={22}
        phrases={[
          "Overlay lyrics precisely",
          "Snap to safe areas",
          "Brand fonts & colors",
          "On‑beat alignment",
          "Export for every platform",
        ]}
      />
      <CaptionLane
        top="62%"
        speed={18}
        reverse
        phrases={[
          "Drag to position",
          "Crisp readable type",
          "Smart line breaks",
          "Karaoke highlights",
          "Render 9:16 / 1:1 / 16:9",
        ]}
      />
      {/* Edge fade mask */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,1),rgba(10,10,10,0)_8%,rgba(10,10,10,0)_92%,rgba(10,10,10,1))]" />
    </motion.div>
  );
}

function CaptionLane({
  top,
  speed,
  reverse = false,
  phrases,
}: {
  top: string;
  speed: number;
  reverse?: boolean;
  phrases: string[];
}): React.ReactElement {
  const distance = 50; // percent of width to travel per cycle
  const duration = distance / speed; // seconds; higher speed -> shorter duration
  return (
    <div className="absolute left-0 right-0" style={{ top }}>
      <div className="relative mx-auto w-[90%] overflow-hidden">
        <motion.div
          className="flex min-w-[200%] gap-4"
          animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
          transition={{
            duration: duration * 10,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {[...phrases, ...phrases].map((text, idx) => (
            <div
              key={`${text}-${idx}`}
              className="whitespace-nowrap rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur"
            >
              {text}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function Handle({
  className = "",
}: {
  className?: string;
}): React.ReactElement {
  return (
    <span
      className={`pointer-events-none absolute h-2.5 w-2.5 rounded-full border border-white/30 bg-white/40 ${className}`}
    />
  );
}
