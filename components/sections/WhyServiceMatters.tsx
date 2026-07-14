"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { WHY_MATTERS } from "@/lib/data";

export default function WhyServiceMatters() {
  return (
    <section
      id="services"
      className="relative overflow-hidden py-28 md:py-40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-80 w-[50rem] -translate-x-1/2 rounded-full bg-brand-blue/10 blur-[130px]"
      />
      <div className="relative mx-auto max-w-content px-6 md:px-10">
        <SectionHeading
          eyebrow="The Difference"
          title="Why RO Service Matters"
          subtitle="Neglect is invisible — until it isn't. Regular servicing keeps every drop as pure as the day your purifier was installed."
          dark
        />

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {WHY_MATTERS.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <motion.article
                whileHover={{ y: -8 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm"
              >
                {/* Hover glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(80% 60% at 50% 0%, rgba(0,92,255,0.14), transparent 60%)",
                  }}
                />
                <div className="relative">
                  <div className="flex items-baseline gap-2">
                    <span className="bg-gradient-to-b from-white to-cyan-glow bg-clip-text text-5xl font-semibold tracking-tightest text-transparent">
                      {item.metric}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-white/40">
                      {item.metricLabel}
                    </span>
                  </div>
                  <h3 className="mt-8 text-2xl font-semibold tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-white/55">
                    {item.body}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-brand-blue to-cyan-glow transition-all duration-700 ease-out-expo group-hover:w-full" />
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
