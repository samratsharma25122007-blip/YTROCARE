"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { Icons } from "@/components/ui/Icons";
import { PRICING } from "@/lib/data";

export default function Pricing() {
  // Render order: Basic, Standard, Premium (Premium highlighted, raised).
  const ordered = [...PRICING].sort((a, b) => {
    const rank = { Basic: 0, Standard: 1, Premium: 2 } as Record<string, number>;
    return rank[a.tier] - rank[b.tier];
  });

  return (
    <section
      id="pricing"
      className="relative overflow-hidden py-28 md:py-40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-10 h-80 w-[45rem] -translate-x-1/2 rounded-full bg-brand-blue/10 blur-[130px]"
      />
      <div className="relative mx-auto max-w-content px-6 md:px-10">
        <SectionHeading
          eyebrow="Simple, Transparent"
          title="Pricing"
          subtitle="No hidden charges at your doorstep. Choose the care your RO deserves."
          dark
        />

        <div className="mt-20 grid items-center gap-6 lg:grid-cols-3">
          {ordered.map((plan, i) => (
            <Reveal key={plan.tier} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex h-full flex-col overflow-hidden rounded-3xl border p-8 backdrop-blur-sm ${
                  plan.highlight
                    ? "border-brand-blue/40 bg-gradient-to-b from-brand-blue/[0.12] to-white/[0.02] shadow-glow lg:scale-[1.04]"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                {plan.highlight && (
                  <>
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-cyan-glow/20 blur-3xl"
                    />
                    <span className="absolute right-6 top-6 rounded-full border border-cyan-glow/40 bg-cyan-glow/10 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-cyan-glow">
                      Best Value
                    </span>
                  </>
                )}

                <div className="relative">
                  <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-white/50">
                    {plan.tier}
                  </h3>
                  <p className="mt-1 text-xs text-white/40">{plan.tagline}</p>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-5xl font-semibold tracking-tightest text-white">
                      {plan.price}
                    </span>
                    <span className="text-sm text-white/45">{plan.cadence}</span>
                  </div>
                </div>

                <ul className="relative mt-8 flex-1 space-y-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-white/70">
                      <Icons.check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          plan.highlight ? "text-cyan-glow" : "text-brand-blue"
                        }`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="relative mt-10">
                  <Button
                    href="/book"
                    variant={plan.highlight ? "primary" : "ghost"}
                    size="lg"
                    className="w-full"
                  >
                    Book {plan.tier}
                  </Button>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
