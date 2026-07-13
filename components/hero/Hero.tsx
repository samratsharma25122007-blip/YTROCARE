"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Particles from "@/components/ui/Particles";
import { Icons } from "@/components/ui/Icons";
import { scrollTo } from "@/components/layout/SmoothScroll";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-white"
    >
      {/* Soft blue lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, rgba(0,92,255,0.10), transparent 55%), radial-gradient(80% 60% at 50% 110%, rgba(95,211,255,0.14), transparent 60%)",
        }}
      />
      {/* Floating particles */}
      <Particles count={36} color="0,92,255" maxSize={2.2} speed={0.18} />

      {/* Centered purifier visual */}
      <div className="relative z-10 mx-auto flex max-w-content flex-col items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="mb-10"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-ink/10 bg-white/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-brand-blue backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-brand-blue" />
            RO Servicing, Reimagined
          </span>
        </motion.div>

        {/* Purifier — CSS-rendered, perfectly centered, elegantly lit */}
        <PurifierGlyph />

        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.15, ease }}
          className="mt-12 max-w-4xl text-balance text-4xl font-semibold leading-[1.03] tracking-tightest text-brand-ink sm:text-5xl md:text-6xl lg:text-[4.25rem]"
        >
          What Happens To Your RO If You Don&apos;t Service It For 6 Months?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease }}
          className="mt-7 max-w-xl text-balance text-lg text-brand-ink/55"
        >
          Scroll to discover what&apos;s happening inside.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease }}
          className="mt-10"
        >
          <Button href="/book" size="lg">
            Book Service
            <Icons.arrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => scrollTo("#story", 0)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-brand-ink/50 transition-colors hover:text-brand-blue"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.25em]">
          Scroll
        </span>
        <span className="relative flex h-9 w-5 justify-center rounded-full border border-brand-ink/25">
          <span className="mt-1.5 h-1.5 w-1.5 animate-scroll-hint rounded-full bg-brand-blue" />
        </span>
      </motion.button>
    </section>
  );
}

/** A minimal, premium CSS representation of the assembled purifier. */
function PurifierGlyph() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease }}
      className="relative"
    >
      <div className="animate-float">
        <div
          className="relative h-52 w-40 rounded-[2rem] border border-brand-ink/10 bg-gradient-to-b from-white to-[#eef3fb] shadow-[0_40px_80px_-30px_rgba(0,92,255,0.35)] sm:h-64 sm:w-48"
          style={{ backdropFilter: "blur(4px)" }}
        >
          {/* Display panel */}
          <div className="absolute left-1/2 top-6 h-10 w-24 -translate-x-1/2 rounded-lg bg-brand-ink/90">
            <div className="absolute left-1/2 top-1/2 h-1.5 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-glow/80 shadow-glow-cyan" />
          </div>
          {/* Water level */}
          <div className="absolute inset-x-5 bottom-6 top-20 overflow-hidden rounded-xl bg-gradient-to-b from-cyan-glow/20 to-brand-blue/25">
            <motion.div
              className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-brand-blue/40 to-cyan-glow/20"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          {/* Spout */}
          <div className="absolute -right-3 top-24 h-2 w-6 rounded-r-full bg-brand-ink/70" />
        </div>
      </div>
      {/* Reflection */}
      <div
        aria-hidden
        className="mx-auto mt-2 h-16 w-40 rounded-[50%] bg-brand-blue/10 blur-2xl sm:w-48"
      />
    </motion.div>
  );
}
