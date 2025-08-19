"use client";

import React from "react";
import { motion } from "framer-motion";

export function Steps(props: {
  items: Array<{ number: number; title: string; description: string }>;
}): React.ReactElement {
  const { items } = props;

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background elements - simplified */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple
            <span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              3-Step
            </span>{" "}
            Process
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            From upload to finished video in minutes, not hours
          </p>
        </motion.div>

        {/* Simplified timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-fuchsia-500 via-purple-500 to-indigo-500 transform -translate-x-1/2" />

          {/* Steps */}
          <div className="space-y-16">
            {items.map((item, index) => (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: index * 0.15,
                }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {/* Step content */}
                <div
                  className={`flex-1 ${
                    index % 2 === 0 ? "pr-12 text-right" : "pl-12 text-left"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="group cursor-pointer"
                  >
                    {/* Step number badge */}
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-500 shadow-lg mb-4 ${
                        index % 2 === 0 ? "ml-auto" : "mr-auto"
                      }`}
                    >
                      <span className="text-2xl font-bold text-white">
                        {item.number}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-fuchsia-300 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                      {item.description}
                    </p>

                    {/* Simple hover effect */}
                    <div
                      className={`h-0.5 bg-gradient-to-r rounded-full mt-4 transition-all duration-300 group-hover:h-1 ${
                        index % 2 === 0
                          ? "from-fuchsia-500 to-purple-500 ml-auto"
                          : "from-purple-500 to-fuchsia-500 mr-auto"
                      }`}
                      style={{
                        width: index % 2 === 0 ? "0%" : "0%",
                      }}
                    />
                  </motion.div>
                </div>

                {/* Timeline connector - simplified */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-500 border-4 border-neutral-900 shadow-lg" />
                </div>

                {/* Spacer for odd steps */}
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>

          {/* Bottom accent - simplified */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
            className="flex justify-center mt-16"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-xl">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
