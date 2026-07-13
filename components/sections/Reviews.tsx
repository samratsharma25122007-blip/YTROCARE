"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { Icons } from "@/components/ui/Icons";
import { REVIEWS } from "@/lib/data";

export default function Reviews() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const go = (d: number) => {
    setDir(d);
    setIndex((i) => (i + d + REVIEWS.length) % REVIEWS.length);
  };

  const review = REVIEWS[index];

  return (
    <section
      id="reviews"
      className="relative overflow-hidden bg-brand-black py-28 md:py-40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/4 top-1/4 h-96 w-96 rounded-full bg-brand-blue/10 blur-[130px]"
      />
      <div className="relative mx-auto max-w-content px-6 md:px-10">
        <SectionHeading
          eyebrow="Loved By Families"
          title="Customer Reviews"
          subtitle="Thousands of homes now drink safer water. Here's what they say."
          dark
        />

        <div className="relative mx-auto mt-16 max-w-3xl">
          <div className="relative min-h-[22rem] sm:min-h-[18rem]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.figure
                key={index}
                custom={dir}
                initial={{ opacity: 0, x: dir * 60, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: dir * -60, filter: "blur(10px)" }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="glass absolute inset-0 flex flex-col justify-between rounded-3xl p-8 sm:p-12"
              >
                <div>
                  <div className="flex gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Icons.star key={i} className="h-5 w-5 text-cyan-glow" />
                    ))}
                  </div>
                  <blockquote className="mt-6 text-balance text-xl font-medium leading-relaxed tracking-tight text-white/90 sm:text-2xl">
                    “{review.quote}”
                  </blockquote>
                </div>
                <figcaption className="mt-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-cyan-glow text-sm font-semibold text-white">
                    {review.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {review.name}
                    </div>
                    <div className="text-xs text-white/45">{review.role}</div>
                  </div>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              onClick={() => go(-1)}
              aria-label="Previous review"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-300 hover:-translate-x-0.5 hover:border-white/40 hover:text-white"
            >
              <Icons.arrowRight className="h-4 w-4 rotate-180" />
            </button>
            <div className="flex gap-2">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDir(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  aria-label={`Go to review ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === index ? "w-8 bg-cyan-glow" : "w-1.5 bg-white/25"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => go(1)}
              aria-label="Next review"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-300 hover:translate-x-0.5 hover:border-white/40 hover:text-white"
            >
              <Icons.arrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
