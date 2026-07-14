"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { SERVICE_COMPONENTS } from "@/lib/data";

/**
 * Interactive exploded purifier. Hovering (or tapping) a node highlights the
 * component and reveals its role. Nodes float over an abstract schematic.
 */
export default function ServiceIncluded() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden py-28 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-cyan-glow/5 blur-[120px]"
      />
      <div className="relative mx-auto max-w-content px-6 md:px-10">
        <SectionHeading
          eyebrow="Every Detail"
          title="What's Included In Every Service"
          subtitle="Ten precision checkpoints. Nothing skipped. Hover any part to see exactly what our engineers care for."
          dark
        />

        <div className="mt-20 grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          {/* Interactive schematic */}
          <div className="relative aspect-square w-full max-w-xl rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent">
            {/* Central purifier silhouette */}
            <div className="absolute left-1/2 top-1/2 h-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-brand-blue/20 bg-brand-blue/[0.04]" />

            {SERVICE_COMPONENTS.map((c, i) => {
              const isActive = active === i;
              return (
                <button
                  key={c.name}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${c.x}%`, top: `${c.y}%` }}
                  aria-label={c.name}
                >
                  <span className="relative flex items-center justify-center">
                    <span
                      className={`absolute h-8 w-8 rounded-full transition-all duration-500 ${
                        isActive
                          ? "scale-150 bg-brand-blue/30"
                          : "scale-100 bg-transparent"
                      }`}
                    />
                    <span
                      className={`relative h-3 w-3 rounded-full border transition-all duration-300 ${
                        isActive
                          ? "border-cyan-glow bg-cyan-glow shadow-glow-cyan"
                          : "border-white/40 bg-white/10 group-hover:border-cyan-glow"
                      }`}
                    />
                  </span>
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className="pointer-events-none absolute left-1/2 top-6 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-brand-ink/90 px-3 py-1 text-xs font-medium text-white backdrop-blur"
                      >
                        {c.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>

          {/* Detail panel + list */}
          <div>
            <div className="min-h-[7rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active ?? "default"}
                  initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="text-2xl font-semibold tracking-tight text-white">
                    {active !== null
                      ? SERVICE_COMPONENTS[active].name
                      : "10-Point Deep Service"}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/55">
                    {active !== null
                      ? SERVICE_COMPONENTS[active].desc
                      : "Hover a node on the schematic to explore each component we clean, inspect and restore."}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
              {SERVICE_COMPONENTS.map((c, i) => (
                <li key={c.name}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className={`flex items-center gap-2 text-left text-sm transition-colors duration-300 ${
                      active === i ? "text-white" : "text-white/45 hover:text-white/80"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full transition-colors ${
                        active === i ? "bg-cyan-glow" : "bg-white/25"
                      }`}
                    />
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
