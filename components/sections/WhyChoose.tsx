"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { Icons } from "@/components/ui/Icons";
import { WHY_CHOOSE } from "@/lib/data";

export default function WhyChoose() {
  return (
    <section className="relative overflow-hidden py-28 md:py-40">
      <div className="relative mx-auto max-w-content px-6 md:px-10">
        <SectionHeading
          eyebrow="The RO Care India Standard"
          title="Why Choose RO Care India"
          subtitle="Every promise, engineered into the experience."
          dark
        />

        <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {WHY_CHOOSE.map((item, i) => {
            const Icon = Icons[item.icon as keyof typeof Icons];
            const featured = item.title === "Trusted By Thousands";
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
                className={`group relative flex flex-col items-start gap-5 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm ${
                  featured ? "col-span-2 sm:col-span-1 lg:col-span-1" : ""
                }`}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(70% 60% at 30% 0%, rgba(0,92,255,0.14), transparent 60%)",
                  }}
                />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-brand-blue/10 text-cyan-glow transition-transform duration-500 group-hover:-translate-y-1">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="relative text-base font-semibold leading-snug tracking-tight text-white">
                  {item.title}
                </h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
