"use client";

import React from "react";
import { motion } from "framer-motion";

export function FeatureGrid(props: {
  items: Array<{ title: string; description: string; icon: React.ReactNode }>;
}): React.ReactElement {
  const { items } = props;
  return (
    <section className="grid gap-6 pb-16 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg ring-1 ring-white/10"
        >
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
            {item.icon}
          </div>
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <p className="mt-2 text-sm text-white/70">{item.description}</p>
        </motion.div>
      ))}
    </section>
  );
}
