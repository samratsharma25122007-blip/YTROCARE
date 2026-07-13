"use client";

import Reveal from "./Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  dark = false,
  className = "",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <div className={`flex flex-col ${alignment} ${className}`}>
      {eyebrow && (
        <Reveal>
          <span
            className={`mb-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] ${
              dark ? "text-cyan-glow" : "text-brand-blue"
            }`}
          >
            <span className="h-1 w-1 rounded-full bg-current" />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2
          className={`max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tightest sm:text-5xl md:text-6xl ${
            dark ? "text-white" : "text-brand-ink"
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.12}>
          <p
            className={`mt-6 max-w-2xl text-balance text-lg leading-relaxed ${
              dark ? "text-white/60" : "text-brand-ink/60"
            }`}
          >
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
