"use client";

import React from "react";
import { motion } from "framer-motion";

export function FeatureGrid(props: {
  items: Array<{ title: string; description: string; icon: React.ReactNode }>;
}): React.ReactElement {
  const { items } = props;

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background pattern - simplified */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.02),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Powerful Features for
            <span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              Creative Freedom
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Everything you need to create professional lyric videos that
            captivate your audience
          </p>
        </motion.div>

        {/* Simplified grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: index * 0.1,
              }}
              whileHover={{
                y: -4,
                transition: { duration: 0.2 },
              }}
              className="group relative"
            >
              {/* Simplified card design */}
              <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                {/* Icon container - simplified animation */}
                <div className="relative mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white text-xl">{item.icon}</div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-fuchsia-300 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                  {item.description}
                </p>

                {/* Simple hover effect */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-full transition-all duration-300 group-hover:w-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
