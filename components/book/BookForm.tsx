"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/ui/Button";

const FIELDS = [
  { name: "fullName", label: "Full Name", type: "text", placeholder: "Your name", span: 1 },
  { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 ", span: 1 },
  { name: "email", label: "Email", type: "email", placeholder: "you@email.com", span: 1 },
  { name: "city", label: "City", type: "text", placeholder: "Your city", span: 1 },
  { name: "address", label: "Address", type: "text", placeholder: "House / street / area", span: 2 },
  { name: "roBrand", label: "RO Brand", type: "text", placeholder: "Kent, Aquaguard…", span: 1 },
  { name: "roModel", label: "RO Model", type: "text", placeholder: "Model number", span: 1 },
  { name: "date", label: "Preferred Date", type: "date", placeholder: "", span: 1 },
  { name: "time", label: "Preferred Time", type: "time", placeholder: "", span: 1 },
] as const;

export default function BookForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate an async submit — swap for a real endpoint when available.
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
            className="glass rounded-3xl p-6 sm:p-10"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {FIELDS.map((f, i) => (
                <Field key={f.name} index={i} span={f.span}>
                  <label
                    htmlFor={f.name}
                    className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-white/50"
                  >
                    {f.label}
                  </label>
                  <input
                    id={f.name}
                    name={f.name}
                    type={f.type}
                    required
                    placeholder={f.placeholder}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-[15px] text-white placeholder-white/25 outline-none transition-all duration-300 focus:border-cyan-glow/50 focus:bg-white/[0.05] focus:shadow-glow-cyan [color-scheme:dark]"
                  />
                </Field>
              ))}

              <Field index={FIELDS.length} span={2}>
                <label
                  htmlFor="issue"
                  className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-white/50"
                >
                  Describe Your Issue
                </label>
                <textarea
                  id="issue"
                  name="issue"
                  rows={4}
                  placeholder="Low flow, strange taste, leakage, routine service…"
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-[15px] text-white placeholder-white/25 outline-none transition-all duration-300 focus:border-cyan-glow/50 focus:bg-white/[0.05] focus:shadow-glow-cyan"
                />
              </Field>
            </div>

            <div className="mt-9">
              <Button type="submit" size="lg" className="w-full py-5 text-base">
                {submitting ? "Booking…" : "Submit Booking"}
              </Button>
            </div>
          </motion.form>
        ) : (
          <SuccessCard key="success" onReset={() => setSubmitted(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  children,
  index,
  span,
}: {
  children: React.ReactNode;
  index: number;
  span: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className={span === 2 ? "sm:col-span-2" : ""}
    >
      {children}
    </motion.div>
  );
}

function SuccessCard({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, filter: "blur(12px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="glass flex flex-col items-center rounded-3xl px-6 py-20 text-center"
    >
      {/* Animated tick */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 14 }}
        className="relative flex h-24 w-24 items-center justify-center rounded-full bg-brand-blue/15"
      >
        <span className="absolute inset-0 animate-pulse-glow rounded-full bg-brand-blue/10" />
        <svg viewBox="0 0 52 52" className="h-12 w-12">
          <motion.path
            d="M14 27l8 8 16-18"
            fill="none"
            stroke="#5FD3FF"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-8 text-3xl font-semibold tracking-tightest text-white"
      >
        Booking Confirmed
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-4 max-w-md text-white/55"
      >
        Thank you. A certified AutoCare engineer will be assigned to you shortly —
        we&apos;ll confirm your slot on WhatsApp and email.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-10 flex gap-4"
      >
        <Button href="/" variant="ghost">
          Back to Home
        </Button>
        <Button onClick={onReset} variant="ghost">
          Book Another
        </Button>
      </motion.div>
    </motion.div>
  );
}
