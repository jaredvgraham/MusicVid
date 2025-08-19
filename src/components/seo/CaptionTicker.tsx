"use client";

import React from "react";
import { motion } from "framer-motion";

export default function CaptionTicker(): React.ReactElement {
  return (
    <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl ring-1 ring-white/10">
      <TimelineBackdrop />
      <ToolbarFake />
      <div className="relative">
        <Ruler />
        <div className="relative mt-3 h-56">
          <TrackRow
            label="Video"
            hue="from-indigo-400 to-fuchsia-400"
            speed={22}
            heightClass="h-8"
            pattern={[200, 140, 180, 120]}
            waveform
          />
          <TrackRow
            label="Captions"
            hue="from-emerald-400 to-cyan-400"
            speed={28}
            heightClass="h-7"
            pattern={[120, 160, 100, 200]}
            captionBlocks
          />
          <TrackRow
            label="Music"
            hue="from-amber-400 to-rose-400"
            speed={18}
            heightClass="h-6"
            pattern={[240, 180, 200, 160]}
            waveform
          />

          {/* Center playhead */}
          <div className="pointer-events-none absolute inset-y-1 left-1/2 -translate-x-1/2">
            <div className="relative h-full w-px bg-white/40">
              <div className="absolute -top-2 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white" />
              <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white/80" />
            </div>
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40"
              style={{ width: 6, height: 6 }}
              animate={{ opacity: [0.25, 0.85, 0.25] }}
              transition={{
                duration: 1.6,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TrackRow({
  label,
  hue,
  speed,
  heightClass,
  pattern,
  waveform,
  captionBlocks,
}: {
  label: string;
  hue: string; // tailwind gradient classes
  speed: number; // controls scroll speed of loop
  heightClass: string; // tailwind height class for clip height
  pattern: number[]; // widths of clips in px
  waveform?: boolean;
  captionBlocks?: boolean;
}): React.ReactElement {
  // Make a seamless 200% width strip by repeating the pattern twice
  const duration = 24_000 / (speed * 60); // tuned for smooth linear motion
  return (
    <div className="relative mb-4 h-12 last:mb-0">
      {/* Track label */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 rounded-md border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/70">
        {label}
      </div>
      {/* Scrolling lane */}
      <div className="absolute left-28 right-2 top-1/2 -translate-y-1/2 overflow-hidden">
        <motion.div
          className="flex min-w-[200%] gap-2"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration, ease: "linear", repeat: Infinity }}
        >
          {[0, 1].map((loopIndex) => (
            <div key={loopIndex} className="flex min-w-[50%] gap-2">
              {pattern.map((w, i) => (
                <Clip
                  key={`${loopIndex}-${i}`}
                  width={w}
                  hue={hue}
                  heightClass={heightClass}
                  waveform={waveform}
                  captionBlocks={captionBlocks}
                />
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function Clip({
  width,
  hue,
  heightClass,
  waveform,
  captionBlocks,
}: {
  width: number;
  hue: string;
  heightClass: string;
  waveform?: boolean;
  captionBlocks?: boolean;
}): React.ReactElement {
  return (
    <div
      className={`relative ${heightClass} w-[${width}px] min-w-[${width}px] overflow-hidden rounded-md border border-white/15 bg-white/5`}
    >
      {/* Accent fill */}
      <div
        className={`absolute inset-0 rounded-md bg-gradient-to-r ${hue} opacity-25`}
      />
      {/* Subtle grid lines */}
      <div className="absolute inset-y-1 left-1 right-1 rounded bg-[linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] bg-[length:8px_100%] opacity-15" />
      {/* Waveform or caption segments */}
      {waveform ? <Waveform /> : captionBlocks ? <CaptionSegments /> : null}
    </div>
  );
}

function Waveform(): React.ReactElement {
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-1 px-2">
      {Array.from({ length: 28 }).map((_, i) => (
        <div
          key={i}
          className="h-3 w-0.5 rounded-full bg-white/60 sm:h-3.5"
          style={{ height: `${6 + ((i * 13) % 14)}px` }}
        />
      ))}
    </div>
  );
}

function CaptionSegments(): React.ReactElement {
  return (
    <div className="absolute inset-1 flex items-center gap-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bg-white/70"
          style={{ opacity: 0.85 - i * 0.15 }}
        />
      ))}
    </div>
  );
}

function ToolbarFake(): React.ReactElement {
  return (
    <div className="mb-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
        <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
      </div>
      <div className="flex items-center gap-2 text-[10px] text-white/70">
        <span className="rounded-md border border-white/10 bg-white/10 px-1.5 py-0.5">
          Fit
        </span>
        <span className="rounded-md border border-white/10 bg-white/10 px-1.5 py-0.5">
          1/2
        </span>
        <span className="rounded-md border border-white/10 bg-white/10 px-1.5 py-0.5">
          Full
        </span>
      </div>
    </div>
  );
}

function Ruler(): React.ReactElement {
  const ticks = 48;
  return (
    <div className="relative ml-28 mr-2 h-6 overflow-hidden rounded-md border border-white/10 bg-white/5">
      <motion.div
        className="absolute inset-0 flex min-w-[200%]"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 16, ease: "linear", repeat: Infinity }}
      >
        {[0, 1].map((loop) => (
          <div key={loop} className="flex min-w-[50%]">
            {Array.from({ length: ticks }).map((_, i) => (
              <div key={i} className="relative w-8">
                <div className="absolute bottom-0 left-1/2 h-2 w-px -translate-x-1/2 bg-white/30" />
                {i % 4 === 0 ? (
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-white/60">
                    {i / 4}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function TimelineBackdrop(): React.ReactElement {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "16px 100%, 100% 24px",
          backgroundPosition: "0 0, 0 0",
        }}
        animate={{ backgroundPositionX: ["0px", "-16px"] }}
        transition={{ duration: 1.2, ease: "linear", repeat: Infinity }}
      />
      {/* Ambient glows */}
      <div className="absolute -top-28 left-1/4 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="absolute -bottom-28 right-1/3 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
      {/* Soundwave overlay */}
      <SoundWaveOverlay />
      {/* Floating words */}
      <WordGridOverlay
        words={[
          "auto‑sync",
          "style",
          "karaoke",
          "export",
          "timing",
          "fonts",
          "colors",
        ]}
      />
    </div>
  );
}

function SoundWaveOverlay(): React.ReactElement {
  const bars = 96;
  return (
    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
      <div className="mx-auto h-12 w-[90%] overflow-hidden">
        <div className="flex h-full items-end justify-between gap-1">
          {Array.from({ length: bars }).map((_, i) => (
            <motion.span
              key={i}
              className="w-0.5 rounded-full bg-white/25"
              initial={{ scaleY: 0.6 }}
              animate={{ scaleY: [0.6, 1.2, 0.6] }}
              transition={{
                duration: 2.4,
                ease: "easeInOut",
                repeat: Infinity,
                delay: (i % 24) * 0.06,
              }}
              style={{ height: `${8 + ((i * 17) % 28)}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function WordGridOverlay({ words }: { words: string[] }): React.ReactElement {
  const positions = [
    { left: "8%", top: "22%" },
    { left: "28%", top: "12%" },
    { left: "46%", top: "18%" },
    { left: "66%", top: "14%" },
    { left: "14%", top: "78%" },
    { left: "36%", top: "86%" },
    { left: "72%", top: "80%" },
  ];
  return (
    <div className="absolute inset-0">
      {words.slice(0, positions.length).map((w, i) => (
        <motion.span
          key={w + i}
          className="absolute rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/70 backdrop-blur"
          style={{ left: positions[i].left, top: positions[i].top }}
          animate={{ y: [0, -2, 0], opacity: [0.7, 1, 0.7] }}
          transition={{
            duration: 3 + (i % 3),
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          {w}
        </motion.span>
      ))}
    </div>
  );
}
