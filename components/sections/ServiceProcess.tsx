"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { PROCESS_STEPS } from "@/lib/data";

/**
 * Animated vertical timeline. A progress line draws itself as the section
 * scrolls into view; each step reveals in sequence.
 */
export default function ServiceProcess() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 60%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="relative overflow-hidden py-28 md:py-40">
      <div className="relative mx-auto max-w-content px-6 md:px-10">
        <SectionHeading
          eyebrow="How It Works"
          title="Service Process"
          subtitle="From tap to done in six effortless steps. You track every one."
          dark
        />

        <div ref={ref} className="relative mx-auto mt-20 max-w-3xl">
          {/* Rail */}
          <div className="absolute left-[19px] top-2 h-[calc(100%-1rem)] w-px bg-white/10 md:left-1/2 md:-translate-x-1/2" />
          <motion.div
            style={{ scaleY: lineScale, transformOrigin: "top" }}
            className="absolute left-[19px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-cyan-glow to-brand-blue md:left-1/2 md:-translate-x-1/2"
          />

          <ul className="space-y-12">
            {PROCESS_STEPS.map((step, i) => {
              const alignRight = i % 2 === 1;
              return (
                <li
                  key={step.title}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    alignRight ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Node */}
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: "-20%" }}
                      transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-glow/40 bg-brand-ink text-sm font-semibold text-cyan-glow"
                    >
                      {i + 1}
                    </motion.span>
                  </div>

                  {/* Card */}
                  <motion.div
                    initial={{ opacity: 0, x: alignRight ? 24 : -24, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-15%" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className={`w-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm md:w-[calc(50%-3rem)] ${
                      alignRight ? "md:mr-auto md:text-right" : "md:ml-auto"
                    }`}
                  >
                    <h3 className="text-lg font-semibold tracking-tight text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">
                      {step.desc}
                    </p>
                  </motion.div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
