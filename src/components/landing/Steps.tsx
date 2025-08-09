"use client";

import React from "react";
import { motion } from "framer-motion";

export function Steps(props: {
  items: Array<{ number: number; title: string; description: string }>;
}): React.ReactElement {
  const { items } = props;
  return (
    <section className="grid gap-6 pb-20 md:grid-cols-3">
      {items.map((item, index) => (
        <motion.div
          key={item.number}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.06 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg ring-1 ring-white/10"
        >
          <div className="mb-3 inline-flex items-center gap-2 text-xs text-white/60">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10 font-medium text-white/80">
              {item.number}
            </span>
            Step {item.number}
          </div>
          <h4 className="text-base font-semibold">{item.title}</h4>
          <p className="mt-2 text-sm text-white/70">{item.description}</p>
        </motion.div>
      ))}
    </section>
  );
}
