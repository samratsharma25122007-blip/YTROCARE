"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Particles from "@/components/ui/Particles";
import { Icons } from "@/components/ui/Icons";

const ease = [0.16, 1, 0.3, 1] as const;

export default function FinalCTA() {
  return (
    <section className="relative flex min-h-[90svh] items-center justify-center overflow-hidden py-32">
      {/* Subtle dust lingering from the story */}
      <Particles count={50} color="150,160,175" maxSize={1.6} speed={0.1} />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/10 blur-[150px]"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1, ease }}
          className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-glow"
        >
          This is happening inside your RO right now.
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30, filter: "blur(16px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1.1, delay: 0.25, ease }}
          className="mt-8 text-balance text-4xl font-semibold leading-[1.05] tracking-tightest text-white sm:text-5xl md:text-6xl"
        >
          Don&apos;t Wait Until Your Water Becomes Unsafe.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1, delay: 0.55, ease }}
          className="mt-12"
        >
          <Button href="/book" size="lg" className="px-10 py-5 text-lg">
            Book Service
            <Icons.arrowRight className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
