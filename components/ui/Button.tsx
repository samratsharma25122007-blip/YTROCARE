"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ReactNode } from "react";

type Variant = "primary" | "ghost" | "light";
type Size = "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  className?: string;
  type?: "button" | "submit";
  ariaLabel?: string;
}

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight " +
  "transition-[transform,box-shadow,background-color,color] duration-500 ease-out-expo will-change-transform " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/60 focus-visible:ring-offset-2";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-blue text-white shadow-glow hover:shadow-[0_0_90px_-15px_rgba(0,92,255,0.8)] hover:-translate-y-0.5",
  ghost:
    "border border-white/15 text-white/90 hover:border-white/40 hover:bg-white/5 hover:-translate-y-0.5",
  light:
    "border border-brand-ink/15 text-brand-ink hover:border-brand-ink/40 hover:bg-brand-ink/[0.03] hover:-translate-y-0.5",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ariaLabel,
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(120% 120% at 50% 0%, rgba(95,211,255,0.35), transparent 60%)",
          }}
        />
      )}
    </>
  );

  if (href) {
    return (
      <motion.div whileTap={{ scale: 0.97 }} className="inline-block">
        <Link href={href} className={classes} aria-label={ariaLabel}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type}
      onClick={onClick}
      className={classes}
      aria-label={ariaLabel}
    >
      {content}
    </motion.button>
  );
}
